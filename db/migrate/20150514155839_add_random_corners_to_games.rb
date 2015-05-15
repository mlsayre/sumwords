class AddRandomCornersToGames < ActiveRecord::Migration
  def change
    add_column :games, :upperleftspace, :string
    add_column :games, :upperrightspace, :string
    add_column :games, :lowerleftspace, :string
    add_column :games, :lowerrightspace, :string
    add_column :games, :randspace01, :string
    add_column :games, :randspace02, :string
    add_column :games, :randspace03, :string
    add_column :games, :randspace04, :string
    add_column :games, :randspace05, :string
    add_column :games, :randspace06, :string
    add_column :games, :randspace07, :string
    add_column :games, :randspace08, :string
    add_column :games, :randspace09, :string
    add_column :games, :randspace10, :string
    add_column :games, :randspace11, :string
    add_column :games, :randspace12, :string
    add_column :games, :randspace13, :string
    add_column :games, :randspace14, :string
    add_column :games, :randspace15, :string
    add_column :games, :randspace16, :string
  end
end
