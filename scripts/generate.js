'use strict';
const Generate = {
  Template: {
    name: 'Template',
    pluralName: 'Templates',
    schema: 'Joi.object({\n' +
      '  _id: Joi.object(),\n' +
      '  name: Joi.string().required(),\n' +
      '  userId: Joi.boolean().required(),\n' +
      '  time: Joi.date().required()\n' +
    '});',
    payload: 'Joi.object({\n' +
    '  name: Joi.string().required()\n' +
    '});',
    defaultValues: {
      time: 'new Date()'
    },
    indexes: '[\n' +
    '  { key: { name: 1 } },\n' +
    '  { key: { userId: 1 } }\n' +
    '];',
    user: true,
    exampleCreate: [
      'name',
      'userId'
    ],
    tableVars: 'user.username user.name user.studyID name',
    tableFields: 'username name name time studyID userId',
    tableHeaders: ['Username', 'Name', 'Study ID','Template Name'],
    searchField: 'name',
    joiFormValue: [
      'joiFormValue(\'name\', \'{{document.name}}\');'
    ]
  }
};

module.exports = Generate;
