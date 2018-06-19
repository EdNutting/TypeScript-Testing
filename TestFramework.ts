/// <reference path="ITestFramework.d.ts" />
/// <reference path="TestResultsRenderer.ts" />
/// <reference path="TestRunner.ts" />

namespace op_testing {
    export class TestFramework implements ITestFramework {
        
        private resultsReady: boolean = false;
        private cases: Array<ITestCase> = [];
        private runner: ITestRunner = null;
        private renderer: ITestResultsRenderer = null;

        public registerTestCase(testCase: ITestCase): void {
            this.cases.push(testCase);
        }
        public registerTestRunner(runner: ITestRunner): void {
            this.runner = runner;
        }
        public registerResultsRenderer(renderer: ITestResultsRenderer): void {
            this.renderer = renderer;
        }

        public run(names: Array<string> = null): void {
            this.runner.load(this.cases);
            this.resultsReady = false;
            this.runner.run(names).then(() => {
                this.resultsReady = true;
            }).catch((error) => {
                this.resultsReady = true;
            });
        }

        public results(names: Array<string> = null): any {
            if (!this.resultsReady) {
                return "Results Not Ready";
            }

            let results = this.runner.results(names);
            return this.renderer.render(results);
        }
    }
}

window.opTestFramework = new op_testing.TestFramework();
window.opTestFramework.registerTestRunner(new op_testing.TestRunner());
window.opTestFramework.registerResultsRenderer(new op_testing.DjangoTestResultsRenderer());
