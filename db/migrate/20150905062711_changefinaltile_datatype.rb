class ChangefinaltileDatatype < ActiveRecord::Migration
  def change
    change_column :gamedata, :finaltiles, :string
  end
end
