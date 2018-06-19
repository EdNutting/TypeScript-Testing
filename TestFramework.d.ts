/// <reference path="ITestFramework.d.ts" />

declare namespace op_testing {
    export abstract class Assert implements IAssert {

        protected abstract failAssertion(reason: string): void;

        public assertEqual(fst: any, snd: any, msg?: string): boolean;
        public assertNotEqual(fst: any, snd: any, msg?: string): boolean;

        public assertTrue(xpr: boolean, msg?: string): boolean;
        public assertFalse(xpr: boolean, msg?: string): boolean;

        private assertDeep(fst: any, snd: any, msg: string, equalityFunction: (fst: any, snd: any, msg?: string) => boolean): boolean;
        public assertIs(fst: any, snd: any, msg?: string): boolean;
        public assertIsNot(fst: any, snd: any, msg?: string): boolean;

        public assertIsNull(xpr: any, msg?: string): boolean;
        public assertIsNotNull(xpr: any, msg?: string): boolean;

        public assertIsUndefined(xpr: any, msg?: string): boolean;
        public assertIsNotUndefined(xpr: any, msg?: string): boolean;

        public assertIn(fst: any, snd: object | Array<any> | string, msg?: string): boolean;
        public assertNotIn(fst: any, snd: object | Array<any> | string, msg?: string): boolean;

        public assertIsInstance(obj: any, cls: any, msg?: string): boolean;
        public assertIsNotInstance(obj: any, cls: any, msg?: string): boolean;

        public assertRaises(exc: string, callable: Function, ctx: any, args: Array<any>, msg?: string): boolean;
        public assertRaisesRegex(exc: RegExp, callable: Function, ctx: any, args: Array<any>, msg?: string): boolean;

        public assertAlmostEqual(fst: number, snd: number, places?: number, msg?: string): boolean;
        public assertNotAlmostEqual(fst: number, snd: number, places?: number, msg?: string): boolean;

        public assertGreater(fst: number, snd: number, msg?: string): boolean;
        public assertGreaterEqual(fst: number, snd: number, msg?: string): boolean;

        public assertLess(fst: number, snd: number, msg?: string): boolean;
        public assertLessEqual(fst: number, snd: number, msg?: string): boolean;

        public assertRegex(txt: string, reg: RegExp, msg?: string): boolean;
        public assertNotRegex(txt: string, reg: RegExp, msg?: string): boolean;

        public assertCountEqual<T>(fst: Array<T>, snd: Array<T>, msg?: string): boolean;
        public assertCountNotEqual(fst: Array<any>, snd: Array<any>, msg?: string): boolean;

        public assertMultiLineEqual(fst: string, snd: string, msg?: string): boolean;
        public assertMultiLineNotEqual(fst: string, snd: string, msg?: string): boolean;

        public assertJSONEqual(fst: any, snd: any, msg?: string): boolean;
        public assertJSONNotEqual(fst: any, snd: any, msg?: string): boolean;
    }

    export abstract class TestCase extends Assert implements ITestCase {

        private ongoingResult: ITestResult;

        constructor();

        protected failAssertion(reason: string): void;

        public readonly name: string;

        public setUp(): void;
        public tearDown(): void;

        public setUpClass(): void;
        public tearDownClass(): void;

        public run(testName: string, result?: ITestResult): Promise<ITestResult>;
        public debug(testName: string, result?: ITestResult): Promise<ITestResult>;

        protected skip(reason?: string): void;
        protected fail(reason?: string): void;

        public listTestCases(): Array<string>;

        public countTestCases(): number;
    }

    export class TestResult implements ITestResult {
        private _success: boolean | "Skipped" | "Untested";
        private _message: string;
        public data: any;
        public readonly testName: string;

        constructor(testName: string);

        public readonly success;
        public readonly message;

        pass(): void;
        fail(reason: string): void;
        skip(reason: string): void;
    }
    
    export class DjangoTestResultsRenderer implements ITestResultsRenderer {
        public render(results: Array<ITestResult>): any;
    }
    
}
