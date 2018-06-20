/// <reference path="TestResult.ts" />
/// <reference path="ITestFramework.d.ts" />

namespace op_testing {
    export abstract class TestCase extends Assert implements ITestCase {

        private ongoingResult: ITestResult;

        constructor() {
            super();

            window.opTestFramework.registerTestCase(this);
        }

        protected failAssertion(reason: string): void {
            this.fail(reason);
            throw reason;
        }

        public abstract get name();

        public abstract setUp(): void;
        public abstract tearDown(): void;

        public abstract setUpClass(): void;
        public abstract tearDownClass(): void;

        public async run(testName: string, result: ITestResult = new TestResult(testName)): Promise<ITestResult> {
            this.ongoingResult = result;

            if (typeof (this[testName]) === "function") {
                try {
                    this.setUp();
                    try {
                        await (<() => Promise<void>>this[testName])();
                        this.ongoingResult.pass();
                    }
                    catch (ex) {
                        if (this.ongoingResult.success === false || this.ongoingResult.success === "Untested") {
                            this.fail(ex);
                        }
                    }
                    finally {
                        try {
                            this.tearDown();
                        }
                        catch (ex) {
                            this.fail("Tear down failed: " + ex);
                        }
                    }
                }
                catch (ex) {
                    this.fail("Set up failed: " + ex);
                }
            }

            return Promise.resolve(result);
        }
        public async debug(testName: string, result: ITestResult = new TestResult(testName)): Promise<ITestResult> {
            if (typeof (this[testName]) === "function") {
                this.setUp();
                await (<() => Promise<void>>this[testName])();
                this.tearDown();
            }
            return result;
        }

        protected skip(reason: string = "No reason given."): void {
            this.ongoingResult.skip(reason);
        }
        protected fail(reason: string = "No reason given."): void {
            this.ongoingResult.fail(reason);
        }

        public listTestCases(): Array<string> {
            let results: Array<string> = [];
            let prototype = Object.getPrototypeOf(this);
            let keys = Reflect.ownKeys(prototype);
            for (let func of keys) {
                if ((typeof (this[func]) === "function") &&
                    (typeof func) === "string" &&
                    (<string>func).indexOf("test") === 0) {
                    results.push(<string>func);
                }
            }
            return results;
        }

        public countTestCases(): number {
            return this.listTestCases().length;
        }
    }
}
