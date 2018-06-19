/// <reference path="ITestFramework.d.ts" />

namespace op_testing {
    export class DjangoTestResultsRenderer implements ITestResultsRenderer {
        public render(results: Array<ITestResult>): any {
            let output = {
                text: "",
                results: {},
                errors: []
            };

            results = results.sort((a: ITestResult, b: ITestResult): number => {
                return a.testName.localeCompare(b.testName);
            });

            for (let result of results) {
                output.results[result.testName] = {
                    name: result.testName,
                    success: result.success,
                    message: result.message,
                    data: result.data
                };
                switch (result.success) {
                    case true:
                        output.text += ".";
                        break;    
                    case false:
                        output.text += "F";
                        output.errors.push(result.testName + " : " + result.message);
                        break;
                    case "Skipped":
                        output.text += "S";
                        output.errors.push(result.message);
                        break;
                    case "Untested":
                        output.text += "U";
                        break;    
                }
            }

            return output;
        }
    }
}