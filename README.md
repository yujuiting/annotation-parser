# annotation-parser

---

## Usage
require

    getAllAnnotation(file_path, opt, callback);
    getAllAnnotationSync(file_path, opt);

test.js

    /**
     * annotation1
     * @key1 value1-1
     * @key1 value1-2
     * @pre-key2 value2
     */
     
parse

    getAllAnnotation('./test.js', function (err, annotation_blocks) {
      console.log(annotation_blocks[0]);
    });
    
output

    [{key:'key1',value:'value1-1',annotation:(...)},
     {key:'key1',value:'value1-2',annotation:(...)}
     {key:'pre-key2',value:'value2',annotation:(...)}]
    
## Options

merge `boolean`

    {
      'key1': ['value1-1', 'value1-2'],
      'pre-keys': 'value2'
    }

prefix `string`  
set prefix to 'pre-', case above would output:

    [{key:'pre-key2',value:'value2',annotation:(...)}]

removePrefix `boolean`  
only work when prefix is setup, removing prefix when output:

    [{key:'key2',value:'value2',annotation:(...)}]