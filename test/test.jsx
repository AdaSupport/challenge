var assert = require('assert');

import React from "react";
import { mount } from "enzyme";
import InputForm from "../components/input-form";

// test to see if it is a string
describe('Empty test', function () {
    it('empty test should run successfully', function () {
        assert.equal('A', 'A');
    });
});


describe("InputForm", () => {
    let props;
    let mountedForm;
    const inputForm = inputForm

    //r esets the props and variables before every test
    beforeEach(() => {
        props = {
            addItem: undefined,
            todo: undefined,
            query: undefined,
        };
        mountedForm = undefined;
    });

    // test that the component will always render a div
    it("always renders a div", () => {
        const divs = inputForm().find("div");
        expect(divs.length).toBeGreaterThan(0);
    });

});