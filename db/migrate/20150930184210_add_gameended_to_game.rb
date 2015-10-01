class AddGameendedToGame < ActiveRecord::Migration
  def change
    add_column :games, :gameended, :boolean, default: false
  end
end
