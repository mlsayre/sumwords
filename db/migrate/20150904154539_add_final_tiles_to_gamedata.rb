class AddFinalTilesToGamedata < ActiveRecord::Migration
  def change
    add_column :gamedata, :finaltiles, :string, array: true, default: []
  end
end
