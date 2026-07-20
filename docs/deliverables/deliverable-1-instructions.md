# Deliverable 1 Screenshot Instructions & Step-by-Step Guide

This guide explains exactly how to install the necessary native GUI tools on Linux and capture the 3 required screenshots for `deliverable-1.md`. 

**Crucial Prerequisite:** Before taking these screenshots, ensure your SentraCX databases (PostgreSQL, MongoDB, Redis) are actively running in the background (e.g., via your Docker Compose setup).

---

## 1. PostgreSQL (CRM Production)
**Tool:** pgAdmin 4

### Installation (Linux)
1. Open your terminal.
2. Install pgAdmin 4 (if not installed) using the official APT repository:
   ```bash
   curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
   sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
   sudo apt install pgadmin4-desktop
   ```
3. Launch pgAdmin 4 from your application menu.

### How to Capture Screenshot 1 (Connection Success)
1. In pgAdmin, right-click **Servers** in the left browser pane and select **Register** -> **Server...**
2. In the **General** tab, name it "SentraCX CRM".
3. In the **Connection** tab, enter the following:
   - **Host name/address:** `localhost`
   - **Port:** `5432`
   - **Maintenance database:** `postgres`
   - **Username:** Your local db user (e.g., `postgres` or `crm_admin`)
   - **Password:** Your local db password
4. Click **Save** to connect.
5. Once connected, the server will appear with a green connection icon or open successfully in the browser tree.
6. 📸 **TAKE SCREENSHOT 1:** Capture the main screen showing the successfully connected "SentraCX CRM" server. Save it as `screenshot-1.png`.

---

## 2. MongoDB (AI-Analytics Document Store)
**Tool:** MongoDB Compass

### Installation (Linux)
1. Open your browser and download the Ubuntu `.deb` package from the [MongoDB Compass Download Page](https://www.mongodb.com/try/download/compass).
2. Open terminal in your downloads folder and install it: `sudo dpkg -i mongodb-compass_*.deb`
3. Launch MongoDB Compass.

### How to Capture Screenshot 2 (Connection View)
1. When Compass opens, you will see a New Connection screen with a URI input bar.
2. Enter your connection string: `mongodb://localhost:27017` (add username:password@ if you have auth enabled).
3. 📸 **TAKE SCREENSHOT 2:** Capture this screen with the URI filled in, right before clicking Connect. Save it as `screenshot-2.png`.

---

## 3. Redis (Key-Value Cache)
**Tool:** RedisInsight

### Installation (Linux)
1. Download the `.AppImage` file from the [RedisInsight Download Page](https://redis.com/redis-enterprise/redis-insight/).
2. In your terminal, make it executable: `chmod +x RedisInsight-*.AppImage`
3. Run it: `./RedisInsight-*.AppImage`

### How to Capture Screenshot 3 (Connected Database)
1. In RedisInsight, click **Add Redis Database** (or "Add Connection").
2. Choose **Add Database Manually**.
3. Enter **Host:** `localhost` and **Port:** `6379`. Name it "SentraCX Redis".
4. Click **Add Database**. 
5. You will be taken back to the main list of databases showing "SentraCX Redis" with a green status indicator.
6. 📸 **TAKE SCREENSHOT 3:** Capture this list showing the connected Redis instance. Save it as `screenshot-3.png`.

---

## Final Step
Once you have `screenshot-1.png`, `screenshot-2.png`, and `screenshot-3.png` saved, place them in a folder (e.g., `docs/deliverables/images/`) and replace the placeholder text in `deliverable-1.md` with standard markdown image links, like this:
`![pgAdmin Connection](./images/screenshot-1.png)`
