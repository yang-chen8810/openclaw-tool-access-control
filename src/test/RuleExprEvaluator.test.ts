import { ERROR, RuleExprEvaluator } from '../evaluator/RuleExprEvaluator.js';

describe('RuleExprEvaluator', () => {
    const evaluate = (expr: string, context: Record<string, any>) => {
        return new RuleExprEvaluator(expr).evaluate(context);
    };

    const setupTestContext = () => {
        return {
            age: 25,
            status: 'active',
            score: 95.5,
            is_premium: true,
            roles: ['admin', 'user'],
            user: {
                name: 'John',
                address: [
                    {
                        city: 'New York', zip: '10001', state: 'NY', coordinates: { lat: 40.7128, lon: -74.0060 }
                    },
                    {
                        city: 'Boston', zip: '02108', state: 'MA', coordinates: { lat: 42.3601, lon: -71.0589 }
                    }
                ],
                metadata: {
                    tags: ['vip', 'early-adopter'],
                    last_login: '2023-01-01'
                }
            },
            config: {
                features: {
                    beta: true,
                    max_users: 100
                }
            }
        };
    };

    test('Logical and Comparison', () => {
        const context = setupTestContext();

        expect(evaluate('age > 18', context)).toBe(true);
        expect(evaluate('age >= 25', context)).toBe(true);
        expect(evaluate('age < 25', context)).toBe(false);
        expect(evaluate('status == "active"', context)).toBe(true);
        expect(evaluate('status != "inactive"', context)).toBe(true);

        // Logical
        expect(evaluate('age > 18 and status == "active"', context)).toBe(true);
        expect(evaluate('is_premium or age > 30', context)).toBe(true);
        expect(evaluate('not (age < 18 or status == "inactive")', context)).toBe(true);
    });

    test('JsonPath Resolving', () => {
        const context = setupTestContext();

        expect(evaluate('user.name', context)).toBe('John');
        expect(evaluate('user.name == "John"', context)).toBe(true);

        // Array index access
        expect(evaluate('user.address[0].city', context)).toBe('New York');
        expect(evaluate('user.address[1].zip == "02108"', context)).toBe(true);

        // Dictionary key string access
        expect(evaluate("user['name']", context)).toBe('John');
    });

    test('Complex JsonPath Resolving', () => {
        const context = setupTestContext();

        // Nested dict in array
        expect(evaluate('user.address[0].state', context)).toBe('NY');
        expect(evaluate("user['address'][1]['state']", context)).toBe('MA');

        // Deeply nested paths
        expect(evaluate('user.address[0].coordinates.lat', context)).toBe(40.7128);
        expect(evaluate('config.features.beta', context)).toBe(true);
        expect(evaluate('config.features.max_users', context)).toBe(100);

        // Array in dict
        expect(evaluate('user.metadata.tags[1]', context)).toBe('early-adopter');

        // Operators with complex paths
        expect(evaluate('"vip" in user.metadata.tags', context)).toBe(true);
        expect(evaluate('user.address[0].coordinates.lat > 40.0', context)).toBe(true);

        // Non-existent paths (should return null)
        expect(evaluate('user.address[2]', context)).toBe(null);
        expect(evaluate('user.address[0].country', context)).toBe(null);
        expect(evaluate('user.missing_field', context)).toBe(null);
        expect(evaluate('config.features.alpha', context)).toBe(null);

        // Invalid operations that resolve to null gracefully
        expect(evaluate('user.address.name', context)).toBe(null);
        expect(evaluate('user.name[0]', context)).toBe(null);
    });

    test('Custom Operators', () => {
        const context = setupTestContext();

        expect(evaluate('status contain "act"', context)).toBe(true);
        expect(evaluate('status not_contain "act"', context)).toBe(false);

        expect(evaluate('user.name match "^J.*n$"', context)).toBe(true);
        expect(evaluate('user.name not_match "^J.*n$"', context)).toBe(false);

        expect(evaluate('user.name like "J*n"', context)).toBe(true);
        expect(evaluate('user.name not_like "J*n"', context)).toBe(false);
        expect(evaluate('user.name like "J??n"', context)).toBe(true);
        expect(evaluate('user.name like "*oh*"', context)).toBe(true);
        expect(evaluate('user.name like "*ah*"', context)).toBe(false);

        expect(evaluate('status start_with "act"', context)).toBe(true);

        expect(evaluate('age in [20, 25, 30]', context)).toBe(true);
        expect(evaluate('score not_in [90.0, 100.0]', context)).toBe(true);

        // Variable right-side array containment
        expect(evaluate('"admin" in roles', context)).toBe(true);
    });

    test('Builtin Functions', () => {
        const context = setupTestContext();

        expect(evaluate('length("active")', context)).toBe(6);
        expect(evaluate('length(user.name)', context)).toBe(4);
        expect(evaluate('length(user.address)', context)).toBe(2);

        expect(evaluate('substring(status, 0, 3)', context)).toBe('act');

        expect(evaluate('upper(status)', context)).toBe('ACTIVE');
        expect(evaluate('lower(user.name)', context)).toBe('john');
        expect(evaluate('upper("hello")', context)).toBe('HELLO');
        expect(evaluate('lower("WORLD")', context)).toBe('world');
    });

    test('Null and Error Evaluation', () => {
        const context: any = setupTestContext();
        context.null_val = null;
        context.err_val = ERROR;

        // Logical AND with null
        expect(evaluate('null_val and false', context)).toBe(false);
        expect(evaluate('false and null_val', context)).toBe(false);
        expect(evaluate('null_val and true', context)).toBe(null);
        expect(evaluate('true and null_val', context)).toBe(null);
        expect(evaluate('null_val and null_val', context)).toBe(null);

        // Logical OR with null
        expect(evaluate('null_val or true', context)).toBe(true);
        expect(evaluate('true or null_val', context)).toBe(true);
        expect(evaluate('null_val or false', context)).toBe(null);
        expect(evaluate('false or null_val', context)).toBe(null);
        expect(evaluate('null_val or null_val', context)).toBe(null);

        // Logical NOT with null
        expect(evaluate('not null_val', context)).toBe(null);

        // Comparison operators with null
        const compOps = ['==', '!=', '>', '>=', '<', '<=', 'contain', 'not_contain', 'match', 'not_match',
            'start_with', 'not_start_with', 'in', 'not_in', 'like', 'not_like'];
        for (const op of compOps) {
            expect(evaluate(`null_val ${op} 5`, context)).toBe(null);
            expect(evaluate(`5 ${op} null_val`, context)).toBe(null);
        }

        const err = ERROR;

        // Logical AND with ERROR
        expect(evaluate('err_val and true', context)).toBe(err);
        expect(evaluate('true and err_val', context)).toBe(err);
        expect(evaluate('err_val and false', context)).toBe(err);
        expect(evaluate('false and err_val', context)).toBe(err);
        expect(evaluate('err_val and null_val', context)).toBe(err);
        expect(evaluate('null_val and err_val', context)).toBe(err);

        // Logical OR with ERROR
        expect(evaluate('err_val or true', context)).toBe(err);
        expect(evaluate('true or err_val', context)).toBe(err);
        expect(evaluate('err_val or false', context)).toBe(err);
        expect(evaluate('false or err_val', context)).toBe(err);
        expect(evaluate('err_val or null_val', context)).toBe(err);
        expect(evaluate('null_val or err_val', context)).toBe(err); 

        // Logical NOT with ERROR
        expect(evaluate('not err_val', context)).toBe(err);

        // Comparison operators with ERROR
        for (const op of compOps) {
            expect(evaluate(`err_val ${op} 5`, context)).toBe(err);
            expect(evaluate(`5 ${op} err_val`, context)).toBe(err);
        }
    });

    test('String Escape Sequences', () => {
        const context = setupTestContext();

        expect(evaluate('"hello \\"world\\""', context)).toBe('hello "world"');
        expect(evaluate("'hello \\'world\\''", context)).toBe("hello 'world'");
        expect(evaluate('"line1\\nline2"', context)).toBe('line1\nline2');
        expect(evaluate('"tab\\there"', context)).toBe('tab\there');
        expect(evaluate('"back\\\\slash"', context)).toBe('back\\slash');
    });

    test('Trim Function', () => {
        const context = setupTestContext();

        expect(evaluate('trim("  hello  ")', context)).toBe('hello');
        expect(evaluate('trim("no_spaces")', context)).toBe('no_spaces');
        expect(evaluate('trim(status)', context)).toBe('active');
    });

    test('toString Function', () => {
        const context: any = setupTestContext();
        context.null_val = null;

        expect(evaluate('toString(age)', context)).toBe('25');
        expect(evaluate('toString(is_premium)', context)).toBe('true');
        expect(evaluate('toString(status)', context)).toBe('active');
        expect(evaluate('toString(user.metadata.tags)', context)).toBe('["vip","early-adopter"]');
        expect(evaluate('toString(user)', context)).toBe(JSON.stringify(context.user));
        expect(evaluate('toString(null_val)', context)).toBe('null');
    });

    test('Register External Function', () => {
        const context = setupTestContext();
        
        const evalDoubleAge = new RuleExprEvaluator('double(age)');
        evalDoubleAge.registerFunction({
            getName: () => 'double',
            execute: (args: any[]) => (args[0] as number) * 2,
        });
        expect(evalDoubleAge.evaluate(context)).toBe(50);

        const evalDouble5 = new RuleExprEvaluator('double(5)');
        evalDouble5.registerFunction({
            getName: () => 'double',
            execute: (args: any[]) => (args[0] as number) * 2,
        });
        expect(evalDouble5.evaluate(context)).toBe(10);
    });

    test('Register Attribute Retriever', () => {
        const evalComputed = new RuleExprEvaluator('computed');
        evalComputed.registerAttributeRetriever('computed', {
            getValue: (ctx: Record<string, any>) => (ctx as Record<string, any>)['age'] + 10,
        });
        expect(evalComputed.evaluate({ age: 25 })).toBe(35);

        const evalComputedGt = new RuleExprEvaluator('computed > 30');
        evalComputedGt.registerAttributeRetriever('computed', {
            getValue: (ctx: Record<string, any>) => (ctx as Record<string, any>)['age'] + 10,
        });
        expect(evalComputedGt.evaluate({ age: 25 })).toBe(true);
    });

    test('Date in/not_in Comparison', () => {
        const context: Record<string, any> = {
            eventDate: new Date('2024-03-15T00:00:00'),
        };

        // Date objects are compared by value, not reference
        expect(evaluate('eventDate in [3/15/2024]', context)).toBe(true);
        expect(evaluate('eventDate not_in [3/15/2024]', context)).toBe(false);
        expect(evaluate('eventDate in [1/1/2024, 3/15/2024]', context)).toBe(true);
        expect(evaluate('eventDate not_in [1/1/2024, 2/1/2024]', context)).toBe(true);
    });

});
