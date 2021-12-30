class CreateGames < ActiveRecord::Migration[6.1]
  def change
    create_table :games do |t|
      t.string :letters

      t.timestamps null: false
    end
  end
end
