import * as React from 'react';
import { shallow } from "enzyme";
import { GameCanvasComponent } from "./game-canvas.component";

describe('<GameCanvasComponent />', () => {
    const filler: any = null;
    it('should set displayFailure to false on DisplayFailure being called', () => {
        const wrapper: any = shallow(<GameCanvasComponent {...filler}/>);
        const instance = wrapper.instance();
        wrapper.setState({
            ...wrapper.state,
            displayFailure: true
        });
        instance.DisplayFailure();
        expect(wrapper.state('displayFailure')).toBeFalsy();
    });

    it('should toggle isDrawing on toggleDraw', () => {
        const wrapper: any = shallow(<GameCanvasComponent {...filler}/>);
        const instance = wrapper.instance();
        instance.isDrawing = true;
        instance.toggleDraw();
        expect(wrapper.state('isDrawing')).toBeFalsy();
    });

});
