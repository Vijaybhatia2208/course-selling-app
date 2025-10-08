for updated Userschema with ref 
```


    purchasedCourses: [{type: ObjectId, ref: 'Course'}] // refrences of array

userModel.findByIdAndUpdate(userId, { $addToSet: { purchasedCourses: courseId }})
userModel.findByIdAndUpdate(userId, { $push: { purchasedCourses: courseId }})
User.updateOne(
  {"id": "1"},
  {$push: {purchasedCourses: courseId}}
)

Operator	Behavior	Duplicate Handling	Use Case
-> \$push	Appends a specified value to an array.	Allows duplicates. If the value already exists in the array, it is added again.	When you want to treat the array as a log or list where order and repetition matter (e.g., a history of actions, a stream of comments).
-> \$addToSet	Appends a specified value to an array, only if the value does not already exist in the array.	Prevents duplicates. If the value exists, no operation is performed.	When you want to treat the array as a set where each element must be unique (e.g., a list of tags, user IDs, or, as in your example, purchased courses).
```


Export to Sheets



```
User.findById("1");

User.findOne({
  username: "harkirat@gmail.com"
})

User.find({
  username: "harkirat96@gmail.com"
})

User.updateOne(
  { "id": "1" },
  { $push: { purchasedCourses: courseId } }
)
```


```

User.updateOne({
  id: "1"
}, {
  password: "newPassword"
})

//many enteries
User.update({}, {
  premium: true
})
```

```
User.delete({})
User.delete({
  username: "emailId"
})
```