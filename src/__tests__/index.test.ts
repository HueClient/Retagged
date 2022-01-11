import { Retagged, Category, Tag } from '../index';

test('Only returns existing Tags.', async () => {
  let rTag = new Retagged();

  rTag.CreateCategory('Math')
    .CreateTag('max', () => {
      return 'YES';
    });

  let result = await rTag.Execute(`{{Author.username>String.ToLowerCase}} {{Math.max}} \\{{Math.max 920,4050}}`);
  expect(result).toEqual(['YES']);
});

test('Another Random Test', async () => {
  let rTag = new Retagged();

  rTag.CreateCategory('Math')
    .CreateTag('test', () => {
      return 'test';
    })

  let result = await rTag.Execute(`{{Author.username>String.ToLowerCase}} {{Math.test}} {{Math.max}} \\{{Math.max 920,4050}}`);
  expect(result).toEqual(['test']);
});