var path = require('path'),
    fs = require('fs');

var annotation_block_regex = /(?!\/*\*)([^\/])*(?=\*\/)/g,
    annotation_info_regex = /\* @/;

module.exports = getAllAnnotation = function (file_path, opt, callback) {
  if (arguments.length < 3)
    callback = opt;
  var annotation_blocks = [];
  fs.readFile(file_path, { encoding: 'utf-8'}, function (err, data) {
    try {
      var match_result = data.match(annotation_block_regex);
      for (var i = 0; i < match_result.length; i++) {
        annotation_blocks.push(parseAnnotationBlock(match_result[i], opt||{}));
      }
    } catch (err) {
      callback(err);
    }
    callback(null, annotation_blocks);
  });
}

module.exports = getAllAnnotationSync = function (file_path) {
  var annotation_blocks = [];
  var data = fs.readFileSync(file_path, { encoding: 'utf-8' });
  var match_result = data.match(annotation_block_regex);
  for (var i = 0; i < match_result.length; i++) {
    annotation_blocks.push(parseAnnotationBlock(match_result[i]));
  }
  return annotation_blocks;
}

function parseAnnotationBlock (annotation_block, opt) {
  var annotation_infos = annotation_block.split('\n').map(function (annotation) {
    return parseAnnotation(annotation, opt);
  }).filter(function (annotation_info) {
    return !!annotation_info;
  });

  if (!!opt.merge) {
    var oring_annotation_infos = annotation_infos;
    annotation_infos = {};
    oring_annotation_infos.forEach(function (annotation_info) {
      if (!!annotation_infos[annotation_info.key]) {
        if (!Array.isArray(annotation_infos[annotation_info.key]))
          annotation_infos[annotation_info.key] = [annotation_infos[annotation_info.key]];
        annotation_infos[annotation_info.key].push(annotation_info.value);
      } else
        annotation_infos[annotation_info.key] = annotation_info.value;
    });
  }

  return annotation_infos;
}

function parseAnnotation (annotation, opt) {
  if (!annotation_info_regex.test(annotation)) return null;

  var infos = annotation.replace(annotation_info_regex, '').trim().split(' '),
      key = infos.shift();

  if (!!opt.prefix&&) {
    if (key.match(opt.prefix))
      key = key.replace(opt.prefix, '');
    else
      return null;
  }

  return {
    key: key,
    value: (infos.length === 1) ? infos[0] : infos,
    annotation: annotation
  };
}