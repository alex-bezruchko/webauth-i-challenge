
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.string('username', 255).notNullable().unique()
    table.string('name', 55).notNullable()
    table.string('password', 55).notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
