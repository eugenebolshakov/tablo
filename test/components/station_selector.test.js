import { mount } from '@vue/test-utils';
import StationSelector from '../../src/components/station_selector.vue';

test('selecting suggestion', () => {
  const wrapper = mount(StationSelector);
  let input = wrapper.find('input');

  input.setValue('let');
  let suggestion = wrapper.find('.dropdown a.dropdown-item:first-of-type');
  expect(suggestion.text()).toBe('Letchworth Garden City');

  suggestion.trigger('click');
  expect(input.element.value).toBe('Letchworth Garden City');
  expect(wrapper.findAll('.dropdown').exists()).toBe(false);
  expect(wrapper.emitted().input).toEqual([['LET']]);
});
