class AddGamefullToGame < ActiveRecord::Migration
  def change
    add_column :games, :gamefull, :boolean, default: false
  end
end
