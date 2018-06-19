declare interface Window {
    opTestFramework: op_testing.ITestFramework;
}

declare namespace op_testing {
    export interface ITestFramework {
        registerTestCase(testCase: ITestCase): void;
        registerTestRunner(testRunner: ITestRunner): void;
        registerResultsRenderer(renderer: ITestResultsRenderer): void;

        run(names?: Array<string>): void;
        results(names?: Array<string>): any;
    }

    export interface IAssert {
        assertEqual(fst: any, snd: any, msg?: string): boolean;
        assertNotEqual(fst: any, snd: any, msg?: string): boolean;

        assertTrue(xpr: boolean, msg?: string): boolean;
        assertFalse(xpr: boolean, msg?: string): boolean;

        assertIs(fst: any, snd: any, msg?: string): boolean;
        assertIsNot(fst: any, snd: any, msg?: string): boolean;

        assertIsNull(xpr: any, msg?: string): boolean;
        assertIsNotNull(xpr: any, msg?: string): boolean;

        assertIsUndefined(xpr: any, msg?: string): boolean;
        assertIsNotUndefined(xpr: any, msg?: string): boolean;

        assertIn(fst: any, snd: object | Array<any> | string, msg?: string): boolean;
        assertNotIn(fst: any, snd: object | Array<any> | string, msg?: string): boolean;

        assertIsInstance(obj: any, cls: any, msg?: string): boolean;
        assertIsNotInstance(obj: any, cls: any, msg?: string): boolean;

        assertRaises(exc: string, callable: Function, ctx: any, args: Array<any>, msg?: string): boolean;
        assertRaisesRegex(exc: RegExp, callable: Function, ctx: any, args: Array<any>, msg?: string): boolean;

        assertAlmostEqual(fst: number, snd: number, places?: number, msg?: string): boolean;
        assertNotAlmostEqual(fst: number, snd: number, places?: number, msg?: string): boolean;

        assertGreater(fst: number, snd: number, msg?: string): boolean;
        assertGreaterEqual(fst: number, snd: number, msg?: string): boolean;

        assertLess(fst: number, snd: number, msg?: string): boolean;
        assertLessEqual(fst: number, snd: number, msg?: string): boolean;

        assertRegex(txt: string, reg: RegExp, msg?: string): boolean;
        assertNotRegex(txt: string, reg: RegExp, msg?: string): boolean;

        assertCountEqual<T>(fst: Array<T>, snd: Array<T>, msg?: string): boolean;
        assertCountNotEqual(fst: Array<any>, snd: Array<any>, msg?: string): boolean;

        assertMultiLineEqual(fst: string, snd: string, msg?: string): boolean;
        assertMultiLineNotEqual(fst: string, snd: string, msg?: string): boolean;

        assertJSONEqual(fst: any, snd: any, msg?: string): boolean;
        assertJSONNotEqual(fst: any, snd: any, msg?: string): boolean;
    }

    export interface ITestCase extends IAssert {
        readonly name: string;

        setUp(): void;
        tearDown(): void;

        setUpClass(): void;
        tearDownClass(): void;

        run(testName: string, result?: ITestResult): Promise<ITestResult>;
        debug(testName: string, result?: ITestResult): Promise<ITestResult>;

        listTestCases(): Array<string>;
        countTestCases(): number;
    }

    export interface ITestResult {
        pass(): void;
        fail(reason: string): void;
        skip(reason: string);

        readonly testName: string;
        readonly success: boolean | "Skipped" | "Untested";
        readonly message: string;
        data: any;
    }

    export interface ITestResultsRenderer {
        render(results: Array<ITestResult>): any;
    }

    export interface ITestRunner {
        load(testCases: Array<ITestCase>): void;
        run(testNames?: Array<string>): Promise<void>;
        results(testNames?: Array<string>): Array<ITestResult>;
    }
}