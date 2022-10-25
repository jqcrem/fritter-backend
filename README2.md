CONCEPT User

STATE
userID: ObjectId
username: string
password: string
dateJoined: datetime
rootUserID: string
rootUsername: string
permissions: Map (enum --> int)
accessKey: string
name: string
phoneNumber: string

ACTIONS
addOne(username: string, password: string, name: string, rootUserID, rootUsername, phoneNumber: string)
	dateJoined = today's date
	permissions = default permissions
	accessKey = generate access key
	new UserModel(username, password, dateJoined, rootUserID, rootUsername, permissions, accessKey, name, phoneNumber)

findByUserID(id: objectID)
	return UserModel.findOne(id: id)

findByUsername(username: string)
	return UserModel.findOne(username: username)

findOneByUsernameAndPassword(username: string, password: string)
	return UserModel.findOne(username: username, password: password)

updateOne(id: objectId, details: json)
	user = UserModel.findOne(id: id)
	if username in details:
		user.username = details.username
	if password in details:
		user.password = details.password
	etc...
	user.save()

deleteOne(id: objectId)
	UserModel.deleteOne(id)

--new ones --

findAllByRootUser(id: objectID)
	users = UserModel.find(rootUserID: id)
	return user

findOneByPhoneNumber(phoneNumber: string)
	user = UserModel.findOne(phoneNumber: phoneNumber)
	return user

MIDDLEWARE
isCurrentSessionUserExists(userID)
	return users.findOneByUserID(userID) is not None

isValidUsername(username: string)
	return bool(req.body.username fulfills regex)
	
isValidPassword(password: string)
	return bool(password fulfills regex)

isAccountExists(username, password)
	if username or password is None
		return Error
	accounts = users.findByOneByUsernameAndPassword(username, password)
	if accounts is empty:
		return True
	return False

isUsernameNotAlreadyInUse(username)
	accounts = users.findOneByUsername(accounts: req.body.username)
	if accounts is empty:
		return True
	return False

isUserLoggedIn():
	return bool(session.userID is not none)

isUserLoggedOut()
	return bool(session.userID is None)
	
isNotMaxAliasesReached()
	currentAccount = users.findOneByUserID(_id: req.session.userId)
	aliases = users.findAliases(_id: req.session.userId)
	return currentAccount.permissions['max_aliases'] < len(aliases)

isAuthorExists()
	return req.query.author is not None

--new ones--

isPhoneNumberNotInUse(phoneNumber: string)
	accounts = users.findOneByPhoneNumber(phoneNumber)
	return len(account) == 0

isNewRootAccountValid():
	if is root account:
		make sure phone number 

isCurrentSessionUserCorrectUser(userId):
	return req.session.userId == userId

isValidAliasParams(password)
	userId = req.session.userId
	user = UserCollection.findOne(id: userId)
	if user.password != req.body.password:
		return False
	if user.phoneNumber == None:
		return False

isNewAliasAccountValid():
	

ROUTES
signInUser(username: string, password: string)
	ifAccountExists(username, password)
	ifUsernameValid(username)
	ifPasswordValid(password)
	ifUserLoggedOut()
	sign in
	
SignOutUser()
	ifAccountExists(username, password)
	ifUsernameValid(username)
	ifPasswordValid(password)
	ifUserLoggedOut()
	sign out

createUserAccount(username: string, password: string, name: string, phoneNumber, isAlias)
	if isUsernameNotAlreadyInUse(username)
	if isUsernameValid(username)
	if isPasswordValid(username)
	if isNewRootAccountValid()
	if isNewAliasAccountValid()
	
	rootUserId = None
	if isAlias:
		currentUser = UserCollection.findOneByUserId(req.session.userId)
		phoneNumber = currentUser.phoneNumber
		rootUser = currentUser.userId
	
	UserCollection.addOne(username, password, name, rootUserId, rootUsername, phoneNumber)


updateUserProfile(username: string, password: string, newUsername: string, newPassword: string)

deleteUser()
	if isUserLoggedIn
	UserCollection.deleteOne(userId)
	FreetCollect.ion.deleteMany(userId)

addAlias(newUsername: string, rootPassword: string) XXX
	rootUserId = req.session.userId
	rootUser = UserCollection.findOne(id: rootUserId)
	rootUsername = rootUser.username
	UserCollection.addOne(newUsername, rootPassword, rootUserId, rootUsername)

upgradePermissions() XXX
	--find freets of user
	--find followers of user
	do calculation. 
	If change is not big, stays same
	if change is big, make update

updateAccessKey()
	currentUser = UserCollection.findOneByUserId(req.session.userId)
	allAliases = UsersCollection.findAllByRootUser(req.session.userId)
	newAccessKey = generate New Access Key
	for user in allAliases:
		user.accessKey = newAccessKey
		user.save()

findAliases() XXX
	if isCurrentSessionUserCorrectUser:

	userId = req.session.userID
	users = UserCollection.findAllByRootUser(userId)
	return [user for user if user.userID != req.session.userId]

VALIDATORS
addAlias(newUsername: string, rootPassword: string)
	isUserLoggedIn
	isValidUsername
	isUsernameNotAlreadyInUse
	isValidPassword
	ADD: 
	isValidAliasParams
	isNotMaxAliasesReached

upgradePermissions()

updateAccessKey()

findAliases()


	
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
CONCEPT Freet

STATE
authorID: objectID --> User
dateCreated: datetime
content: string
dateModified: datetime
accessKey: string
freetBreakdownID: objectID --> FreetBreakdown

ACTIONS
addOne(authorId: ObjectID, content: string, accesskey: string, freetBreakdownId: objectID)
	date = new Date
	freet = new Freet(authorID, dateCreated: date, dateModified: date, accessKey: accesskey, freetBreakdownId: freetBreakdownId)
	freet.save()

findOne(freetId: ObjectID)
	return FreetModel.findOne(_id: freetId)

findAll()
	return FreetModel.find().sort(dateModified: -1)

findAllByUsername(username: string)
	authorId = UserCollection.findOneByUsername(username)
	return FreetModel.find(authorID: authorId)

updateOne(freetId: ObjectId, details: json)
	freet = FreetModel.findOne(_id: freetId)
	if content in details:
		freet.content = details.content
	if accessKey in details:
		freet.accessKey = details.accessKey
	etc...
	freet.dateModified = new Date()
	freet.save()
	
deleteOne(freetId:ObjectId)
	FreetModel.deleteOne(id: freetId)

findAllByuserID(userId: ObjectID)
	return FreetModel.find(id: userId)

MIDDLEWARE
isFreetExists(freetId: ObjectId)
	freet = FreetCollection.findOne(freetId)
	return freet is not None

isValidFreetContent(content: string)
	return len(content) > 0

isValidFreetModifier(freetId: ObjectId)
	freet = FreetCollection.findOne(id: fretted)
	return req.session.userID == freet.authorID

ROUTES
getAllFreets()
	allfreets = FreetCollection.findAll()
	return allfreets

createNewFreet(content: string, freetBreakdownId: ObjectID)
	userId = req.session.userID
	currentUser = UserCollection.findOneByUserID(id: userId)
	accessKey = currentUser.accessKey
	FreetCollection.addOne(authorID: userId, content: content, accessKey: accessKey, freetBreakdownID: freetBreakdownId)

deleteFreet(freetId: ObjectId)
	FreetCollection.deleteOne(freetId: fretted)

updateFreet(freetId: ObjectId, content: string)
	FreetCollection.updateOne(freetId: freetId, details: {'content': content})

updateAccessKeys()
	userId = req.session.userID
	user = UserCollection.findOne(id: userId)
	freets = FreetCollection.findAllByUserId(id: userId)
	for freet in freets:
		FreetCollection.updateOne(freetId: freet.id, details: {'accessKey': user.accessKey}

mergeFreets(freetIds: [] -> objectID)
	freets = []
	for freetId in freetIds:
		f = FreetCollection.findOne(id: freetId)
		freets = freets.append(f)
	allContent = ''.join([f.content for f in freets])
	FreetCollection.updateOne(freetId: freets[0].id, details: {'content': allContent})
	for freetId in freetIds[1:]:
		FreetCollection.deleteOne(freetId: freetId)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
CONCEPT FreetBreakdown

STATE
authorID: objectID --> User
dateCreated: datetime
dateModified: datetime
freets: list[]-> Freet

ACTIONS
addOne(authorID: ObjectID, freets:[]->freetId) XXX
	freetBreakdown = new FreetBreakdownModel({authorID: authorID, freets: freets})
	freetBreakdown.save()

findOne(freetBreakdownID: ObjectId) XXX
	return FreetBreakdownModel.findOne(_id: freetBreakdownID)

findAll()
	return FreetBreakdownModel.find()

findAllByUserID(userID: objectID) XXX
	return FreetBreakdownModel.find(authorID: user.id)

findAllByUsername(username: string) XXX
	user = UserCollection.findOneByUsername(username)
	return FreetBreakdownModel.find(authorID: user.id)

updateOne(freetBreakdownId: ObjectId, freets:[]->freetId) XXX
	freetBreakdown = FreetBreakdownModel.findOne(_id: freetBreakdownID)
	freetBreakdown.freets = freets
	freetBreakdown.save()

deleteOne(freetBreakdownID: ObjectId)
	return FreetBreadownModel.deleteOne(_id: freetBreakdownID)

MIDDLEWARE
isValidFreetBreakdownContent(contents):
	for content in contents:
		if len(content) < 1:
			return False
	return True

userMaxFreetBreakdownsNotReached(authorID)
	user = UserCollection.findOneByUserID(authorID)
	userFreetbreakdowns = FreetBreakdownCollection.findAllByUserID(authorID)
	if len(userFreetBreakdowns) >= user.permissions['max_breakdowns']:
		return False
	return True
	
isFreetBreakdownExists(freetBreakdownID)
	freetBreakdown = FreetBreakdownCollection.findOne(freetBreakdownID)
	return freetBreakdown is not None
	

isValidFreetBreakdownModifier(freetBreakdownID)
	freetBreakdown = FreetBreakdownCollection.findOne(freetBreakdownID)
	return req.sesion.userID == freetBreakdown.authorID
	
isFreetInBreakdown(freetBreakdownID, freetID)
	freetBreakdown = FreetBreakdownCollection.findOne(freetBreakdownID)
	return freetID in freetBreakdown.freets
	

ROUTES
deleteFreetBreakdown(freetBreakdownID): XXX
	freetBreakdown = freetBreakdownCollection.find(freetBreakdownId)
	for freetId in freetBreakdown.freets:
		FreetCollection.deleteOne(freetId)
	return FreetBreakdownCollection.deleteOne(freetBreakdownID)

getAllFreetBreakdowns() XXX
	return FreetBreakdownCollection.findAll()

getFreetBreakdownsByUser() XXX
	userID = req.session.userID
	return FreetBreakdownCollection.findAllByUserID(userID)

createNewFreetBreakdown(authorID: ObjectID, contents: [] -> string) XXX
	freet_ids = []
	for content in contents:
		freet = new Freet({authorID: authorID, content: content})
		freet.save()
		freet_ids.append(freet.id)
	return FreetBreakdownCollection.addOne(authorID: authorID, freets: freet_ids)

addNewContentToBreakdown(freetBreakdownID: ObjectID, content: string, location: int) XXX
	freetBreakdown = FreetBreakdownCollection.findOne(freetBreakdownID: freetBreakdownID)

	freet = new Freet({authorID: authorID, content: content})
	freet.save()

	freetBreakdown.contents.freets.insert(freet.id, location)

	freetBreakdown.save()

addNewFreetToBreakdown(freetBreakdownID: ObjectID, freetID: ObjectId, location: int)
	freetBreakdown = FreetBreakdownCollection.findOne(freetBreakdownID)
	freetBreakdown.freets.insert(freetID, location)
	freetBreakdown.save()
	
OPTIONAL:
mergeFreetBreakdowns(freetBreakdownIDs: [] -> ObjectID)
	freetBreakdowns = []
	for freetBreakdownID in freetBreakdownIDs:
		freetBreakdown = FreetBreakdownCollection.findOne(freetBreakdownID)
		freetBreakdowns.append(freetBreakdown)
	allFreets = flatten([freetBreakdown.freets for freetBreakdown in freetBreakdowns])
	freetBreakdowns[0].freets = allFreets
	freetBreakdowns[0].save()

	for freetBreakdown in freetBreakdowns[1:]:
		FreetCollection.deleteOne(freetBreakdown._id)

removeFreet(freetBreakdownID: ObjectID, freetID: ObjectID) XXX
	freetBreakdown = FreetBreakdownCollection.findOne(freetBreakdownID)
	freetBreakdown.freets.remove(freetID)
	FreetCollection.deleteOne(freetID)
	freetBreakdown.save()
	
OPTIONAL:
rearrangeFreet(freetBreakdownID, freetID: ObjectID, location: int)
	freet = FreetCollection.findOne(freetID)
	FreetBreakdownCollection.removeFreet(freetBreakdownID, freetID)
	freet.save()
	FreetBreakdownCollection.addNewFreetToBreakdown(freetBreakdownID, freetID, location)
	
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
CONCEPT Friend

STATE
userA: objectID --> User
userB: objectID --> User
status: string (enum)

ACTIONS
addOne(userA: ObjectID, userB: ObjectID, status: string)
	friend = new FriendModel(userA: userA, userB: userB, status: status) // Means userA is following userB
	friend.save()

updateOne(friendshipID: objectID, details: json) XXX
	friendship = FriendModel.findOne(_id: friendshipID)
	if 'userA' in details:
		friendship.userA = details.userA
	if 'userB' in details:
		friendship.userB = details.userB
	if 'status' in details:
		friendship.status = details.status
	friendship.save()

deleteOne(friendshipID: objectID) XXX
	friend = FriendModel.deleteOne(friendshipID)

findFriendshipByPair(userA: objectID, userB: objectID, status: string) XXX
	friend = FriendModel.find({userA: userA, userB: userB})
	return friend

findAllFriendsByStatus(userID: objectID, status: string): XXX
	return FriendModel.find(userA: userID, status: status)

findManyByFilter(filter: json)
	friendships = FriendModel.find(filter)
	return friendships

MIDDLEWARE
isUserFriendshipModifier(userB: objectID, status: string)
	if status == "FOLLOWING" or status == "FOLLOWER"

isUserFriendshipDeleter(friendshipID) //to be used in followup check
	userID = req.session.userID
	friendship = FriendCollection.findOne(id: friendshipID)
	return userID == FriendCollection.UserA

isUsersExist(userA, userB):
	userA = UserCollection.findOneByUserID(userA)
	userB = UserCollection.findOneByUserID(userB)
	if userA is None or userB is None:
		return False
	return True

isFriendshipDoesNotExist(friendshipID: objectID)
	friendship = FriendCollection.findOne(id: friendshipID)
	return friendship is None

isFriendshipExists(friendshipID: objectID)
	friendship = FriendCollection.findOne(id: friendshipID)
	return friendship is not None

isUserNotBlocked(userB)
	userA = req.session.userID
	blockedFriendship = FriendCollection.findFriendshipByPair(userB, userA, status: "BLOCKED")
	return blockedFriendship is None

isUserBNotUserA(userA, userB)
	return userA != userB

isFriendMyFriendWithThiStatus(userB, status)
	myfriendshipwithB = FriendCollection.findFriendshipByPair(req.session.userID, userB, status)
	return myfriendshipwithB is not None
	

ROUTES
follow(UserID: ObjectID) XXX
	userA = req.session.userID
	FriendCollection.addOne(userA, UserID, "FOLLOWING") // means userA is following userB
	FriendCollection.addOne(UserID, userA, "FOLLOWER") // means userA is a follower of userB

unfollow(UserID: ObjectID) XXXX -- some problems that need fixing
	userA = req.session.userID
	userB = userID
	followingFriendship = findFriendshipByPair(userA, userB, "FOLLOWING")
	followerFriendship = findFriendshipByPair(userB, userA, "FOLLOWER")
	FriendCollection.deleteOne(followingFriendship.id)
	FriendCollection.deleteOne(followerFriendship.id)
	//leave circles:
	circlesIAmIn = CircleCollection.findManyByMemberOnly(memberID: userA)
	for circle in circlesIAmIn:
		circle.members.remove(userA)
		CircleCollection.updateOne(circle.id, {'members': members})

block(UserID: ObjectID) XXX
	userA = req.session.userID
	userB = UserID
	followingFriendship = findFriendshipByPair(userB, userA, "FOLLOWING") //Note that order is switched here
	followerFriendship = findFriendshipByPair(userB, userA, "FOLLOWER") //
	FriendCollection.updateOne(followingFriendship.id, "BLOCKED")
	FriendCollection.updateOne(followerFriendship.id, "BLOCKED")
	
findAllFollowers() XXX
	userA = req.session.userID
	return FriendCollection.FindAllFriendsByStatus(UserID: userA, status: "FOLLOWER")

findAllFollowing() XXX
	userA = req.session.userID
	return FriendCollection.FindAllFriendsByStatus(UserID: userA, status: "FOLLOWING")

findAllBlocked() XXX
	userA = req.session.userID
	return FriendCollection.FindAllFriendsByStatus(UserID: userA, status: "BLOCKED")

unblock() XXX

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
CONCEPT Circle

STATE
authorID: objectID --> User
members: list[] --> User
access: list[] --> User
accessKeys: [] --> string

ACTIONS
addOne(authorID: ObjectID, members: list[] -> ObjectID, access: list[] -> ObjectID)
	accessKeys = []
	for userID in access:
		user = UserCollection.findOneByUserID(userID)
		accessKeys.append(user.accessKey)
	circle = new CircleModel(authorID: authorID, members: members, access: access, accessKeys: accessKeys)
	circle.save()

findOne(circleID: ObjectID)
	return CircleModel.findOne(_id: circleID)

updateOne(circleID: ObjectID, details: json)
	circle = CircleModel.findOne(_id: circleID)
	if members in details:
		circle.members = members
	if access in details:
		circle.access = access
	circle.save()

deleteOne(circleID: ObjectID)
	CircleModel.deleteOne(_id: circleID)

findManyByAuthorID(authorID: ObjectID)
	circles = CircleModel.find('authorID': authorID)

OPTIONAL:
findManyByAuthorAndAccess(authorID: ObjectID, accessId: ObjectID)
	circles = CircleModel.find( {'authorID': authorID, 'access': {'contains': accessUser}})
	return circles

OPTIONAL:
findOneByAuthorAndAllAccess(authorID: ObjectID, access: [] -> ObjectID)
	circle = CircleMOdel.find({'authorID': authorID, 'access': access}
	return circle

OPTIONAL:
findManyByAuthorAndMember(authorID: ObjectID, memberId: ObjectID)
	circles = CircleModel.find( {'authorID': authorID, 'members': {'contains': accessUser}})
	return circles

findManyByMemberOnly(memberId: ObjectID):
	circles = CircleModel.find({'members': {'contains': accessUser}})
	return circles

MIDDLEWARE
isValidCircleModifier(circleID: ObjectID)
	circle = CircleCollection.findOne(CircleID: circleID)
	return circle.authorID == req.session.userID

isuserMaxCirclesNotReached
	currentUser = UserCollection.findOne(req.session.userID)
	currentUserCircles = CircleCollection.findManyByAuthorID(authorID: req.session.userID)
	return currentUser.permissions['max_circles'] > len(currentUserCircles)

iscircleOfThisTypeNonexistent(access: [] -> objectID)
	userID = req.session.userID
	circles = CircleCollection.findManyByAuthorAndAlLAccess(authorID: userID, access)
	return len(circles) == 0

isCircleExists(circleID: ObjectID)
	circle = CircleCollection.findOne(circleID: circleID)
	return circle is not None

isFriendNotInCircle(circleID: ObjectID, friendID: ObjectID)
	circle = CircleCollection.findOne(circleID: circleID)
	return friendID not in circle.members

isFriendInCircle(circleID: ObjectID, friendID: ObjectID)
	circle = CircleCollection.findOne(circleID: circleID)
	return friendID in circle.members

isCurrentUserInCircle(circleID: ObjectID)
	circle = CircleCollection.findOne(circleID: circleID)
	return req.session.userID in circle.members

isValidCircle(access: [] -> ObjectID):
	return len(access) > 0

isValidFriend(friendID: ObjectID):
	friend = FriendColection.findFriendshipByPair(friendID, req.session.userID, 'FOLLOWING')

ROUTES
createNewCircle(members: list[] -> ObjectID, access: list[] -> ObjectID)
	authorID = req.session.userID
	CircleCollection.addOne(authorID: authorID, members: members, access: access)

deleteCircle(circleID: ObjectID)
	CircleCollection.deleteOne(circleID: circleID)

findAllCurrentUserCircles()
	authorID = req.session.userID
	circles = CircleCollection.findManyByAuthorID(authorID: authorID)
	return circles
	
findAllCirclesWithThisFriend(friendID: ObjectID)
	return CircleCollection.findManyByAuthorAndMember(authorID: req.session.userID, memberID: friendID)

findAllCirclesImIn()
	return CircleCollection.findManyByMemberOnly(memberId: req.session.userID)

findAllCirclesWithAccessToUser(userID: ObjectID)
	return CircleCollection.findManyByAuthorAndAccess(authorID: req.session.userID, accessId: userID)

leaveCircle(circleID: ObjectID)
	circle = CircleCollection.findOne(circleID: circleID)
	circle.members.remove(req.session.userID)
	CircleCollection.updateOne(circle.id, {'members': members})

addFriendToCircle(friendID: ObjectID, circleID: ObjectID)
	circle = CircleCollection.findOne(circleID: circleID)
	circle.members.add(friendID)
	CircleCollection.updateOne(circle.id, {'members': members})
	
removeFriendFromCircle(friendID: ObjectID, circleID: ObjectID)
	circle = CircleCollection.findOne(circleID: circleID)
	circle.members.remove(friendID)
	CircleCollection.updateOne(circle.id, {'members': members})

updateAccessKeys()
	allMyCircles = findAllCurrentUserCircles()
	for circle in allMyCircles:
		accessKeys = []
		for userID in circle.access:
			user = UserCollection.findOne(userID)	
			accessKeys.append(user.accessKey)
		circle.accessKeys = accessKeys
		CircleCollection.updateOne(circle.id, {'accessKeys': accessKeys})
	
VALIDATION
createNewCircle(members: list[] -> ObjectID, access: list[] -> ObjectID)
	isValidCircle
	isCircleOfThisTypeNonexistent

deleteCircle(circleID: ObjectID)
	isCircleExists
	isValidCircleModifier

findAllCurrentUserCircles()
	isAuthorExists -> UserCollection
	
findAllCirclesWithThisFriend(friendID: ObjectID)
	isValidFriend

findAllCirclesImIn()

findAllCirclesWithAccessToUser(userID: ObjectID)

leaveCircle(circleID: ObjectID)
	isCurrentUserInCircle

addFriendToCircle(friendID: ObjectID, circleID: ObjectID)
	isValidFriend
	isValidCircleModifier
	isFriendNotInCircle
	
removeFriendFromCircle(friendID: ObjectID, circleID: ObjectID)
	isValidCircleModifier
	isFriendNotInCircle

updateAccessKeys()



