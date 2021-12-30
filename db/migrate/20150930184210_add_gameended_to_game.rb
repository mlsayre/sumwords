class AddGameendedToGame < ActiveRecord::Migration[6.1]
  def change
    add_column :games, :gameended, :boolean, default: false
  end
end
