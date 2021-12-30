class ChangefinaltileDatatype < ActiveRecord::Migration[6.1]
  def change
    change_column :gamedata, :finaltiles, :string
  end
end
