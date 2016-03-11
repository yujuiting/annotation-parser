var path = require('path');
var parser = require('../');
var filepath = path.resolve(__dirname, './test.js'),
    opt;

function expect (result) {
    return {
      eq: function(expectValue){
        if (typeof result === 'object')
          for(var k in result) expect(result[k]).eq(expectValue[k]);
        else if(result!=expectValue)throw new Error('eq');
      },
      has: function(expect){if(!result[expect])throw new Error('expect');},
      length: function (expect){if(result.length!==expect)throw new Error('length');},
      isArray: function(expect){if(!Array.isArray(result))throw new Error('is array');}
    }
}

expect(parser.getAllAnnotationSync(filepath)).length(3);
expect(parser.getAllAnnotationSync(filepath)[0]).length(3);
expect(parser.getAllAnnotationSync(filepath)[2]).length(5);

opt = { merge: true }
expect(parser.getAllAnnotationSync(filepath, opt)).length(3);
expect(parser.getAllAnnotationSync(filepath, opt)[0]).has('is');
expect(parser.getAllAnnotationSync(filepath, opt)[0].is).eq('person');
expect(parser.getAllAnnotationSync(filepath, opt)[0].name).eq('John');
expect(parser.getAllAnnotationSync(filepath, opt)[0].can).isArray('person');
expect(parser.getAllAnnotationSync(filepath, opt)[0].can).length(3);
expect(parser.getAllAnnotationSync(filepath, opt)[0].can).eq(['eat', 'speak', 'sleep']);

opt = { merge: true, prefix: 'super-' };
expect(parser.getAllAnnotationSync(filepath, opt)).length(1);
expect(parser.getAllAnnotationSync(filepath, opt)[0]).has('super-is');
expect(parser.getAllAnnotationSync(filepath, opt)[0]['super-name']).eq('Super-John');

opt = { merge: true, prefix: 'super-', removePrefix: true };
expect(parser.getAllAnnotationSync(filepath, opt)[0]).has('is');
expect(parser.getAllAnnotationSync(filepath, opt)[0]['name']).eq('Super-John');