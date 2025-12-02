# 数据库重置指南

## 方法 1: 使用 MongoDB Compass (推荐)

1. 打开 MongoDB Compass
2. 连接到你的数据库
3. 在左侧选择数据库（默认: `voting_db`）
4. 点击数据库名称旁边的 **"..."** 菜单
5. 选择 **"Drop Database"**
6. 确认删除

## 方法 2: 使用 MongoDB Shell (mongosh)

### 本地 MongoDB:
```bash
mongosh
use voting_db
db.dropDatabase()
exit
```

### MongoDB Atlas (远程):
```bash
mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/voting_db"
use voting_db
db.dropDatabase()
exit
```

## 方法 3: 使用提供的脚本

### 使用 shell 脚本:
```bash
./reset-database.sh
```

### 使用 JavaScript 脚本:
```bash
mongosh reset-database.js
# 或对于旧版本 MongoDB:
mongo reset-database.js
```

## 方法 4: 手动删除所有集合

在 MongoDB Compass 或 shell 中，逐个删除以下集合：
- `users`
- `voters`
- `candidates`
- `parties`
- `preferences`
- `votes`
- `ballots`
- `election_status`
- `election_results`
- `logs`

## 重置后

重置数据库后，重启 Spring Boot 应用。`DataInitializationComponent` 会自动：
1. 创建预设数据（3个政党，6个候选人）
2. 创建固定账户（真实和演示账户）

## 固定账户信息

重置后，以下账户会自动创建：

### 真实账户 (isDemoAccount=false):
- username: `voter`, password: `VOter123!`, role: VOTER
- username: `delegate`, password: `DElegate123!`, role: DELEGATE
- username: `admin`, password: `ADmin123!`, role: ADMIN

### 演示账户 (isDemoAccount=true):
- username: `voter_demo`, password: `VOter123!`, role: VOTER
- username: `delegate_demo`, password: `DElegate123!`, role: DELEGATE
- username: `admin_demo`, password: `ADmin123!`, role: ADMIN

