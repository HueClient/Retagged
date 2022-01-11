import { Retagged } from '../index';

test('Only returns existing Tags.', async () => {
  let rTag = new Retagged();

  rTag.CreateCategory('Math')
    .CreateTag('max', () => {
      return 'YES';
    });

  let result = await rTag.Execute(`{{Math.max}} \\{{Math.max 920,4050}}`);
  expect(result).toEqual(`YES \\{{Math.max 920,4050}}`);
});

test('Another Random Test', async () => {
  let rTag = new Retagged();

  rTag.CreateCategory('Math')
    .CreateTag('test', () => {
      return 'test';
    })

  let result = await rTag.Execute(`{{Math.test}} {{Math.max}} \\{{Math.max 920,4050}}`);
  expect(result).toEqual(`test {{Math.max}} \\{{Math.max 920,4050}}`);
});

test('Test with parameters', async () => {
  let rTag = new Retagged();

  rTag.CreateCategory('Math')
    .CreateTag('test', (n1: number, n2: number) => {
      return Math.max(n1, n2);
    })

  let result = await rTag.Execute(`{{Math.test 19,69}} {{Math.max}} \\{{Math.max 920,4050}}`);
  expect(result).toEqual(`69 {{Math.max}} \\{{Math.max 920,4050}}`);
});

test('Different categories.', async () => {
  let rTag = new Retagged();

  rTag.CreateCategory('Math')
    .CreateTag('test', (n1: number, n2: number) => {
      return Math.max(n1, n2);
    })

  rTag.CreateCategory('Test', 'Testing category.')
    .CreateTag('max', () => {
      return 'max from test works.'
    })

  let result = await rTag.Execute(`{{Math.test 19,69}} {{Test.max}} \\{{Math.max 920,4050}}`);
  expect(result).toEqual(`69 max from test works. \\{{Math.max 920,4050}}`);
});

test('Test with multiple functions.', async () => {
  let rTag = new Retagged();

  rTag.CreateCategory('Math')
    .CreateTag('test', (n1: number, n2: number) => {
      return Math.max(n1, n2);
    })

  let result = await rTag.Execute(`{{Math.test 19,69}} {{Math.test 600,69}} {{Math.test 19,69}} {{Math.max}} \\{{Math.max 920,4050}}`);
  expect(result).toEqual(`69 600 69 {{Math.max}} \\{{Math.max 920,4050}}`);
});