import { Pool } from 'pg';

export const client = new Pool({
  port: 5432,
  host: 'postgres',
  user: 'postgres',
  password: 'postgres',
  database: 'skinsale',
});

export const dbClientSymbol = Symbol('CLIENT');
export const dbClientProvider = {
  provide: dbClientSymbol,
  useValue: client,
};
export async function initDB() {
  client.query(`
  do $$ begin
    create type paymentsStatus as enum('paid', 'refused');
  exception
      when duplicate_object then null;
  end $$;
  

  create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    username varchar(20) not null,
    balance numeric(15,2) default 0
  );

  create table if not exists payments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users (id), 
    status paymentsStatus, 
    amount numeric(15,2)
  );
  insert into users
    (id, username)
  select '65d5f9f7-a31e-48db-8222-7ed765142198', 'John'
  where
      not exists (
          select id from users where id = '65d5f9f7-a31e-48db-8222-7ed765142198'
      );
  `);
}
