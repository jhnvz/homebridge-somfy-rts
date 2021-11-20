"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SomfyRTSPlatformAccessory = void 0;
const api_1 = __importDefault(require("./api"));
/**
 * Platform Accessory
 */
class SomfyRTSPlatformAccessory {
    constructor(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.state = {
            position: 0,
            targetPosition: 0,
            state: 2,
            timer: undefined,
        };
        this.api = new api_1.default(accessory.context.device.ip, accessory.context.device.id, this.platform.log);
        this.name = accessory.context.device.name;
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Somfy')
            .setCharacteristic(this.platform.Characteristic.Model, 'RTS')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.UUID);
        this.service = this.accessory.getService(this.platform.Service.WindowCovering) ||
            this.accessory.addService(this.platform.Service.WindowCovering);
        this.service.setCharacteristic(this.platform.Characteristic.Name, this.name);
        this.service.getCharacteristic(this.platform.Characteristic.CurrentPosition)
            .onGet(this.handleCurrentPositionGet.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.PositionState)
            .onGet(this.handlePositionStateGet.bind(this));
        this.service.getCharacteristic(this.platform.Characteristic.TargetPosition)
            .onGet(this.handleTargetPositionGet.bind(this))
            .onSet(this.handleTargetPositionSet.bind(this));
    }
    async handleCurrentPositionGet() {
        const position = this.state.position;
        this.platform.log.debug(`${this.name}: Get current position ->`, position);
        return position;
    }
    async handlePositionStateGet() {
        const state = this.state.state;
        this.platform.log.debug(`${this.name}: Get current state ->`, state);
        return state;
    }
    async handleTargetPositionGet() {
        const position = this.state.targetPosition;
        this.platform.log.debug(`${this.name}: Get target position ->`, position);
        return position;
    }
    async handleTargetPositionSet(value) {
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }
        this.state.targetPosition = value;
        this.service.setCharacteristic(this.platform.Characteristic.PositionState, this.state.state);
        if (value > this.state.position) {
            if (this.state.state !== this.platform.Characteristic.PositionState.INCREASING) {
                this.state.state = this.platform.Characteristic.PositionState.INCREASING;
                this.service.setCharacteristic(this.platform.Characteristic.PositionState, this.state.state);
                this.api.up();
            }
        }
        else if (value !== this.state.position) {
            if (this.state.state !== this.platform.Characteristic.PositionState.DECREASING) {
                this.state.state = this.platform.Characteristic.PositionState.DECREASING;
                this.service.setCharacteristic(this.platform.Characteristic.PositionState, this.state.state);
                this.api.down();
            }
        }
        this.setPosition(value);
        this.platform.log.debug(`${this.name}: Set target position ->`, value);
    }
    async setPosition(value) {
        this.platform.log.info(`${this.name}: Setting target position ->`, value);
        const timePerStep = this.accessory.context.device.timeToMove / 100;
        const timer = setInterval(move, timePerStep);
        const context = this;
        this.state.timer = timer;
        function move() {
            if (context.state.position === context.state.targetPosition) {
                clearInterval(timer);
                context.state.state = context.platform.Characteristic.PositionState.STOPPED;
                context.service.setCharacteristic(context.platform.Characteristic.PositionState, context.state.state);
                context.state.timer = undefined;
                if (value !== 100 && value !== 0) {
                    context.api.stop();
                }
                context.platform.log.info(`${context.name}: Done setting target position ->`, value);
            }
            else {
                if (value < context.state.position) {
                    context.state.position -= 1;
                }
                else if (value > context.state.position) {
                    context.state.position += 1;
                }
                context.platform.log.debug(`${context.name}: Setting position ->`, context.state.position);
                context.service.setCharacteristic(context.platform.Characteristic.CurrentPosition, context.state.position);
            }
        }
    }
}
exports.SomfyRTSPlatformAccessory = SomfyRTSPlatformAccessory;
//# sourceMappingURL=platformAccessory.js.map