import * as React from 'react';
import {shallow, ShallowWrapper} from "enzyme";
import { HomeComponent } from "./home.component";

describe('<HomeComponent />', () => {
    const filler: any = null;
    // test only functions correctly if line 16 of home component
    // is commented out
    it('should have an unordered list of length 6', () => {
        const wrapper: ShallowWrapper = shallow(<HomeComponent {...filler}/>);
        expect(wrapper.find('ul').children()).toHaveLength(6);
    });

});
