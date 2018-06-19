/// <reference path="ITestFramework.d.ts" />

namespace op_testing {
    export class TestResult implements ITestResult {
        private _success: boolean | "Skipped" | "Untested" = "Untested";
        private _message: string = "[Not set]";
        public data: any = {};

        constructor(public readonly testName: string) { }

        public get success() {
            return this._success;
        }

        public get message() {
            return this._message;
        }

        pass(): void {
            this._success = true;
            this._message = "Passed.";
        }

        fail(reason: string): void {
            this._success = false;
            this._message = reason;
        }

        skip(reason: string): void {
            this._success = "Skipped";
            this._message = reason;
        }
    }
}