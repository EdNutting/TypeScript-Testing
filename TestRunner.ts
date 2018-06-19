/// <reference path="ITestFramework.d.ts" />

namespace op_testing {
    export class TestRunner implements ITestRunner {

        private testCaseMap = {};
        private testCases: Array<ITestCase> = [];
        private testResults: Array<ITestResult> = [];
        
        public load(testCases: Array<ITestCase>): void {
            this.testCases = testCases.slice(0);
            for (let testCase of testCases) {
                let testCaseName = testCase.name;
                this.testCaseMap[testCaseName] = testCase;
            }
        }

        public async run(testNames: Array<string> = null): Promise<void> {
            if (testNames == null) {
                this.testResults = [];

                for (let testCase of this.testCases) {
                    testCase.setUpClass();
                    let testNames = testCase.listTestCases();
                    for (let testName of testNames) {
                        let result = await testCase.run(testName, new TestResult(testCase.name + "." + testName));
                        this.testResults.push(result);
                    }
                    testCase.tearDownClass();
                }
            }
            else {
                for (let i = 0; i < this.testResults.length; i++) {
                    let existingResult = this.testResults[i];
                    if (testNames.indexOf(existingResult.testName) > -1) {
                        this.testResults.splice(i, 1);
                        i--;
                    }
                }

                testNames = testNames.sort();
                let currentTestCase: ITestCase = null;
                let currentTestCaseName = "";
                for (let globalTestName of testNames) {
                    let testCaseName = globalTestName.split(".")[0];
                    let testName = globalTestName.split(".")[1];
                    
                    if (testCaseName !== currentTestCaseName) {
                        if (currentTestCase != null) {
                            currentTestCase.tearDownClass();
                            currentTestCase = null;
                        }
                        currentTestCase = this.testCaseMap[testCaseName];
                        currentTestCaseName = testCaseName;
                        currentTestCase.setUpClass();
                    }

                    let result = await currentTestCase.run(testName, new TestResult(globalTestName));
                    this.testResults.push(result);
                }
                if (currentTestCase != null) {
                    currentTestCase.tearDownClass();
                    currentTestCase = null;
                }
            }
            
            return Promise.resolve();
        }

        public results(testNames: Array<string> = null): Array<ITestResult> {
            if (testNames == null) {
                return this.testResults.slice(0);
            }
            else {
                let results: Array<ITestResult> = [];
                for (let existingResult of this.testResults) {
                    if (testNames.indexOf(existingResult.testName) > -1) {
                        results.push(existingResult);
                    }
                }
                return results;
            }
        }
    }
}