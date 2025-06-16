User.destroy_all

User.create!(
  name: "Test User1",
  email: "test_user1@example.com",
  password: "password",
  password_confirmation: "password",
  address: "123 Main St",
  phone: "123-456-7890"
)
