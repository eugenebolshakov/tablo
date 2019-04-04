import { shallowMount } from '@vue/test-utils';
import App from '../../src/components/app.vue';
import StationSelector from '../../src/components/station_selector.vue';

jest.mock('../../src/departures');
import { findDepartures } from '../../src/departures';

const departures = [
  {
    destination: "Cambridge North",
    warning: true,
    danger: true,
    status: 'DELAYED',
    departure_time: '13:01',
    original_departure_time: '12:00',
    arrival_time: '13:30',
    platform: '2'
  }
];

test('display departures', done => {
  findDepartures.mockImplementation(() => Promise.resolve(departures));
  const wrapper = shallowMount(App);
  expect(wrapper.findAll('section.departures').exists()).toBe(false);
  wrapper.find({ ref: 'departureStation' }).vm.$emit('input', 'LET');
  wrapper.vm.$nextTick(() => {
    let departures = wrapper.find('section.departures');
    expect(departures.exists()).toBe(true);
    expect(departures.find('tbody td:first-child').text()).toBe('Cambridge North');
    done();
  });
});
