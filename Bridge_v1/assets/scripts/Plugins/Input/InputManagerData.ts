import { EventTouch } from "cc";
import InputTypes from "./InputTypes";
import InputSources from "./InputSources";

export type InputManagerData = {
    eventTouch: EventTouch;
    touchSource: InputSources;
    type: InputTypes;
};
