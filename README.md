# Retagged
Custom simplified language created for Aun.

### Keep in mind this is mainly made for Aun and under heavy development.

### Installation

```npm
Coming soon...
```

### Usage

#### *Setting up*
```javascript
const { Retagged } = require('retagged'); // Won't work yet...
const rTag = new Retagged();
```
#### *Adding custom Categories and Tags*
```javascript
rTag.CreateCategory('Name', 'Testing category')
  .CreateTag('test', () => {
    return 'you are awesome';
  })

const StringMessage = 'I think that {{Name.test}}!';
rTag.Execute(StringMessage)
  .then((result) => {
    console.log(result);
    // Expected result:
    // I think that you are awesome!
  })
```

#### *Working with invalid and escaped Tags*
```javascript
rTag.CreateCategory('Name', 'Testing category')
  .CreateTag('test', () => {
    return 'you are awesome';
  })

const StringMessage = `I think that {{Name.test}}!\n` +
  `And you can use \\{{Name.test}}.\n` +
  `And invalid tags won't work at all! {{Name.test2}}`;
rTag.Execute(StringMessage)
  .then((result) => {
    console.log(result);
    // Expected result:
    // I think that you are awesome!
    // And you can use \\{{Name.test}}.
    // And invalid tags won't work at all! {{Name.test2}}
  })
```

#### *Working with parameters*
```javascript
rTag.CreateCategory('Math', 'Testing category')
  .CreateTag('max', (param1, param2) => {
    return Math.max(param1, param2);
  })

const StringMessage = `Higher number from 16 and 69 is {{Math.max 16,69}}.`;
rTag.Execute(StringMessage)
  .then((result) => {
    console.log(result);
    // Expected result:
    // Higher number from 16,69 is 69.
  })
```

****