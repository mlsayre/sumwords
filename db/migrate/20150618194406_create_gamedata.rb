class CreateGamedata < ActiveRecord::Migration[6.1]
  def change
    create_table :gamedata do |t|
      t.integer :user_id
      t.integer :game_id
      t.integer :score

      t.timestamps null: false
    end
  end
end
