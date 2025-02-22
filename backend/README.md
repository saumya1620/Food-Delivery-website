# Tomato-Backend

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:status
npx sequelize-cli seed:generate --name demo-user

1. npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string,password:string
2. npx sequelize-cli model:generate --name FoodCategory --attributes name:string,imagePath:string,status:string
3. npx sequelize-cli model:generate --name Dishes --attributes name:string,description:string,price:float,imageUrl:string,categoryId:integer,type:string
4. npx sequelize-cli seed:generate --name default-food-categories
5. npx sequelize-cli model:generate --name Order --attributes userId:string,items:json,amount:number,address:json,status:string,payment:boolean,deliveryFee:float,discount:float
6. npx sequelize-cli model:generate --name OrderDish --attributes orderId:integer,dishId:integer,quantity:integer
