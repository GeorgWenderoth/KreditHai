import App from "../App";
import renderer from 'react-test-renderer';
import {fireEvent, render, screen} from '@testing-library/react';
import {EinkaufHeader} from "../header/einkaufHeader";
const setup = () => {
    const utils = render(<EinkaufHeader/>)
    const input = utils.getByPlaceholderText('Einkaufspunkt')

    return {
        input,
        ...utils,
    }
}

test("Submit", ()=>{
    const {input} = setup()
    fireEvent.change(input, {target: {value: 'kaufen2'}})
    expect(input.value).toEqual('kaufen2')

   /* const component = renderer.create(
        <App/>
    ); */

    //const element = screen.getByAltText()
    //Eingabe , Submit, in der liste (data) vorhanden,

})

