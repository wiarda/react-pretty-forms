/* global describe test expect */
import React from 'react';
import renderer from 'react-test-renderer';
import Label from '../components/Label';

describe('Label component', () => {
  test('Matches snapshot', () => {
    const component = renderer.create(<Label label="Test Label" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Renders required props', () => {
    const component = renderer
      .create(
        <Label Label="Register">
          <div>Child</div>
        </Label>,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  test('Accepts custom styles', () => {
    const component = renderer
      .create(<Label label="button" labelTextClassName="test-class" />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
