<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Types\Types;
use Doctrine\Migrations\AbstractMigration;

/**
 * Written with the Schema API (no raw SQL) so it runs on PostgreSQL, MySQL/MariaDB and SQLite.
 */
final class Version20260208000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create user table';
    }

    public function up(Schema $schema): void
    {
        // Backticks = quoted identifier in Doctrine ("user" is a reserved word on several platforms).
        $table = $schema->createTable('`user`');
        $table->addColumn('id', Types::INTEGER, ['autoincrement' => true]);
        $table->addColumn('email', Types::STRING, ['length' => 180]);
        $table->addColumn('roles', Types::JSON);
        $table->addColumn('password', Types::STRING, ['length' => 255]);
        $table->addColumn('first_name', Types::STRING, ['length' => 100]);
        $table->addColumn('last_name', Types::STRING, ['length' => 100]);
        $table->addColumn('created_at', Types::DATETIME_IMMUTABLE);
        $table->setPrimaryKey(['id']);
        $table->addUniqueIndex(['email'], 'UNIQ_8D93D649E7927C74');
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('`user`');
    }
}
