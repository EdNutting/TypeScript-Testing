/// <reference path="ITestFramework.d.ts" />

namespace op_testing {
    export abstract class Assert implements IAssert {

        protected abstract failAssertion(reason: string): void;

        public assertEqual(fst: any, snd: any, msg: string = "First item should equal second item."): boolean {
            if (fst === snd) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertNotEqual(fst: any, snd: any, msg: string = "First item should not equal second item."): boolean {
            if (fst !== snd) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        public assertTrue(xpr: boolean, msg: string = "False is not true."): boolean {
            if (xpr === true) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertFalse(xpr: boolean, msg: string = "True is not false."): boolean {
            if (xpr === false) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        private assertDeep(fst: any, snd: any, msg: string, equalityFunction: (fst: any, snd: any, msg?: string) => boolean): boolean {
            let fstTypeName = typeof (fst);
            let sndTypeName = typeof (snd);
            if (equalityFunction(fstTypeName, sndTypeName, msg)) {
                switch (fstTypeName) {
                    case "number":
                    case "boolean":
                    case "string":
                    case "symbol":
                        return equalityFunction(fst, snd, msg);
                    case "undefined":
                    case "function":
                        // Ignore functions
                        return true;
                    case "object":
                        let keys1 = Object.getOwnPropertyNames(fst);
                        let keys2 = Object.getOwnPropertyNames(snd);
                        for (let key of keys1) {
                            if (!this.assertDeep(fst[key], snd[key], msg, equalityFunction)) {
                                return false;
                            }
                        }
                        for (let key of keys2) {
                            if (!this.assertDeep(fst[key], snd[key], msg, equalityFunction)) {
                                return false;
                            }
                        }
                        return true;
                    default:
                        // As of October 2017 no other values of typeof are allowed.
                        throw "Unrecognised type name in JavaScript.";
                }
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertIs(fst: any, snd: any, msg: string = "First item should be the second item."): boolean {
            return this.assertDeep(fst, snd, msg, this.assertEqual);
        }
        public assertIsNot(fst: any, snd: any, msg: string = "First item should not be the second item."): boolean {
            return this.assertDeep(fst, snd, msg, this.assertNotEqual);
        }

        public assertIsNull(xpr: any, msg: string = "Expression should be null."): boolean {
            if (xpr === null) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertIsNotNull(xpr: any, msg: string = "Expression should not be null."): boolean {
            if (xpr !== null) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        public assertIsUndefined(xpr: any, msg: string = "Expression should be undefined."): boolean {
            if (xpr === undefined) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertIsNotUndefined(xpr: any, msg: string = "Expression should not be undefined."): boolean {
            if (xpr !== undefined) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        public assertIn(fst: any, snd: object | Array<any> | string, msg: string = "First item should be found in second item."): boolean {
            switch (typeof snd) {
                case "string":
                    if ((snd as string).indexOf(fst) < 0) {
                        this.failAssertion(msg);
                        return false;
                    }
                    break;
                case "object":
                    if (Array.isArray(snd)) {
                        if (snd.indexOf(fst) < 0) {
                            this.failAssertion(msg);
                            return false;
                        } 
                        return true;
                    }
                    else {
                        if (!(fst in (snd as object))) {
                            this.failAssertion(msg);
                            return false;
                        }
                        return true;
                    }
                default:
                    this.failAssertion("Item of type " + typeof (snd) + " cannot contain anything - this is an invalid test.");    
                    return false;
            }
        }
        public assertNotIn(fst: any, snd: object | Array<any> | string, msg: string = "First item should not be found in second item."): boolean {
            switch (typeof snd) {
                case "string":
                    if ((snd as string).indexOf(fst) > -1) {
                        this.failAssertion(msg);
                        return false;
                    }
                    break;
                case "object":
                    if (Array.isArray(snd)) {
                        if (snd.indexOf(fst) > -1) {
                            this.failAssertion(msg);
                            return false;
                        }
                        return true;
                    }
                    else {
                        if (fst in (snd as object)) {
                            this.failAssertion(msg);
                            return false;
                        }
                        return true;
                    }
                default:
                    this.failAssertion("Item of type " + typeof (snd) + " cannot contain anything - this is an invalid test.");
                    return false;
            }
        }

        public assertIsInstance(obj: any, cls: any, msg: string = "Object should be an instance of the class."): boolean {
            if (obj instanceof cls) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertIsNotInstance(obj: any, cls: any, msg: string = "Object should not be an instance of the class."): boolean {
            if (!(obj instanceof cls)) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        public assertRaises(exc: string, callable: Function, ctx: any, args: Array<any>, msg: string = "Function should raise an exception."): boolean {
            try {
                callable.call(ctx, args);
                this.failAssertion(msg);
                return false;
            }
            catch (ex) {
                return this.assertEqual(ex, exc);
            }
        }
        public assertRaisesRegex(exc: RegExp, callable: Function, ctx: any, args: Array<any>, msg: string = "Function should raise a matching exception."): boolean {
            try {
                callable.call(ctx, args);
                this.failAssertion(msg);
                return false;
            }
            catch (ex) {
                if (!exc.test(ex)) {
                    this.failAssertion(msg);
                    return false;
                }
                return true;
            }
        }
        
        public assertAlmostEqual(fst: number, snd: number, places: number = 7, msg: string = "First number should be almost equal to second number.", delta: number = null): boolean {
            if (delta != null && places != null) {
                throw "Do not specify both 'places' and 'delta' specifiers to 'assertAlmostEqual'.";
            }

            let diff = Math.abs(fst - snd);
            if (places != null) {
                let diffFixed = diff.toFixed(places);
                let converted = parseFloat(diffFixed);
                if (converted === 0) {
                    return true;
                }
                else {
                    this.failAssertion(msg);
                    return false;
                }
            }
            else {
                if (diff < delta) {
                    return true;
                }
                else {
                    this.failAssertion(msg);
                    return false;
                }
            }
        }
        public assertNotAlmostEqual(fst: number, snd: number, places: number = 7, msg: string = "First number should not be almost equal to second number.", delta = null): boolean {
            if (delta != null && places != null) {
                throw "Do not specify both 'places' and 'delta' specifiers to 'assertNotAlmostEqual'.";
            }

            let diff = Math.abs(fst - snd);
            if (places != null) {
                let diffFixed = diff.toFixed(places);
                let converted = parseFloat(diffFixed);
                if (converted !== 0) {
                    return true;
                }
                else {
                    this.failAssertion(msg);
                    return false;
                }
            }
            else {
                if (diff > delta) {
                    return true;
                }
                else {
                    this.failAssertion(msg);
                    return false;
                }
            }
        }

        public assertGreater(fst: number, snd: number, msg: string = "First number should be greater than the second."): boolean {
            if (fst > snd) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertGreaterEqual(fst: number, snd: number, msg: string = "First number should be greater than or equal to the second."): boolean {
            if (fst >= snd) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        public assertLess(fst: number, snd: number, msg: string = "First number should be less than the second."): boolean {
            if (fst < snd) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertLessEqual(fst: number, snd: number, msg: string = "First number should be less than or equal to the second."): boolean {
            if (fst <= snd) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        public assertRegex(txt: string, reg: RegExp, msg: string = "Regex should match value."): boolean {
            if (reg.test(txt)) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }
        public assertNotRegex(txt: string, reg: RegExp, msg: string = "Regex should not match value."): boolean {
            if (!reg.test(txt)) {
                return true;
            }
            else {
                this.failAssertion(msg);
                return false;
            }
        }

        public assertCountEqual<T>(fst: Array<T>, snd: Array<T>, msg: string = null): boolean {
            if (this.assertEqual(fst.length, snd.length)) {
                let sndCopy = snd.slice(0);
                for (let elem of fst) {
                    let index = snd.indexOf(elem);
                    if (index < 0) {
                        this.failAssertion(msg || "Arrays should contain the same elements.");
                        return false;
                    }
                    else {
                        snd.splice(index, 1);
                    }
                }
                return true;
            }
            else {
                this.failAssertion(msg || "Arrays should contain the same number of items.");
                return false;
            }
        }
        public assertCountNotEqual(fst: Array<any>, snd: Array<any>, msg: string = null): boolean {
            if (this.assertEqual(fst.length, snd.length)) {
                let sndCopy = snd.slice(0);
                for (let elem of fst) {
                    let index = snd.indexOf(elem);
                    if (index < 0) {
                        return true;
                    }
                    else {
                        snd.splice(index, 1);
                    }
                }
                this.failAssertion(msg || "Arrays should not contain the same items.");
                return false;
            }
            else {
                return true;
            }
        }

        public assertMultiLineEqual(fst: string, snd: string, msg: string = "Multiline strings should be equal."): boolean {
            let strippedFst = fst.replace(/\r/gi, "");
            let strippedSnd = snd.replace(/\r/gi, "");
            return this.assertEqual(strippedFst, strippedSnd, msg);
        }
        public assertMultiLineNotEqual(fst: string, snd: string, msg: string = "Multiline strings should not be equal."): boolean {
            let strippedFst = fst.replace(/\r/gi, "");
            let strippedSnd = snd.replace(/\r/gi, "");
            return this.assertNotEqual(strippedFst, strippedSnd, msg);
        }

        public assertJSONEqual(fst: any, snd: any, msg: string = "JSON objects should be the same."): boolean {
            return this.assertDeep(fst, snd, msg, this.assertEqual);
        }
        public assertJSONNotEqual(fst: any, snd: any, msg: string = "JSON objects should not be the same."): boolean {
            return this.assertDeep(fst, snd, msg, this.assertNotEqual);
        }
    }
}