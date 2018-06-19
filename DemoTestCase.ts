/// <reference path="TestFramework.d.ts" />

namespace op_logs_testing {
    export class DemoTestCase extends op_testing.TestCase {
        
        public get name() {
            return "DemoTestCase";
        }

        public setUp(): void { }
        public tearDown(): void { }

        public setUpClass(): void { }
        public tearDownClass(): void { }

        public testDemo() {
            this.assertTrue(true);
        }
    }

    new DemoTestCase();
}