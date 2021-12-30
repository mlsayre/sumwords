class AddGamefullToGame < ActiveRecord::Migration[6.1]
  def change
    add_column :games, :gamefull, :boolean, default: false
  end
end
