const mongoose = require('mongoose');
const db = require('../rsci/db')

var test_db

beforeAll(async () => {
    test_db = new db()
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});


test('db.settings', async () => {
    var res = await test_db.settings.read()
    expect(res).toBeNull();
    await test_db.settings.save({clientId: '1.2.3.4', isServer: true });
    res = await test_db.settings.read();
    expect(res.clientId).toBe('1.2.3.4');
    expect(res.isServer).toBeTruthy();
    await test_db.settings.save({clientId: '4.3.2.1', isServer: false });
    res = await test_db.settings.read();
    expect(res.clientId).toBe('4.3.2.1');
    expect(res.isServer).toBeFalsy();
    await test_db.settings.save({clientId: '1.2.3.4', isServer: false });
    res = await test_db.settings.read();
    expect(res.clientId).toBe('1.2.3.4');
    expect(res.isServer).toBeFalsy();
});


test('db.experimentSessionsLocal', async () => {
    var list = await test_db.experimentSessionsLocal.getList();
    expect(list.length).toBe(0);
    var exp = await test_db.experimentSessionsLocal.read(1);
    expect(exp).toBeNull();
    await test_db.experimentSessionsLocal.save({
        experimentSessionId: 1,
        experimentId: 2,
        experimentConfig: { prop1: "abc" },
        clientId: "myClient1",
        sessionStartTime: new Date(),
        actions: [1, 2, 3]
    });
    list = await test_db.experimentSessionsLocal.getList();
    expect(list.length).toBe(1);
    exp = await test_db.experimentSessionsLocal.read(1);
    expect(exp.experimentId).toBe("2");
    expect(exp.clientId).toBe("myClient1");
    await test_db.experimentSessionsLocal.save({
        experimentSessionId: 2,
        experimentId: 3,
        experimentConfig: {},
        clientId: "myClient2",
        sessionStartTime: new Date(),
        actions: []
    });
    list = await test_db.experimentSessionsLocal.getList();
    expect(list.length).toBe(2);
    exp = await test_db.experimentSessionsLocal.read(2);
    expect(exp.experimentId).toBe("3");
    expect(exp.clientId).toBe("myClient2");
    exp = await test_db.experimentSessionsLocal.read(3);
    expect(exp).toBeNull();
    await test_db.experimentSessionsLocal.save({
        experimentSessionId: 1,
        experimentId: 9,
        experimentConfig: {},
        clientId: "myClient9",
        sessionStartTime: new Date(),
        actions: []
    });
    list = await test_db.experimentSessionsLocal.getList();
    expect(list.length).toBe(2);
    exp = await test_db.experimentSessionsLocal.read(1);
    expect(exp.experimentId).toBe("9");
    expect(exp.clientId).toBe("myClient9");
});


test('db.experimentSessionsServer', async () => {
    var list = await test_db.experimentSessionsServer.getList();
    expect(list.length).toBe(0);
    var exp = await test_db.experimentSessionsServer.read(1);
    expect(exp).toBeNull();
    await test_db.experimentSessionsServer.save({
        experimentSessionId: 1,
        experimentId: 2,
        clients: [1, 2, 3],
        sessionStartTime: new Date(),
        sessionCompleted: false,
        sessionCompleteTime: null,
    });
    list = await test_db.experimentSessionsServer.getList();
    expect(list.length).toBe(1);
    exp = await test_db.experimentSessionsServer.read(1);
    expect(exp.experimentId).toBe("2");
    expect(exp.sessionCompleted).toBeFalsy();
    await test_db.experimentSessionsServer.save({
        experimentSessionId: 2,
        experimentId: 3,
        clients: [9],
        sessionStartTime: new Date(),
        sessionCompleted: true,
        sessionCompleteTime: new Date(),
    });
    list = await test_db.experimentSessionsServer.getList();
    expect(list.length).toBe(2);
    exp = await test_db.experimentSessionsServer.read(2);
    expect(exp.experimentId).toBe("3");
    expect(exp.sessionCompleted).toBeTruthy();
    exp = await test_db.experimentSessionsServer.read(3);
    expect(exp).toBeNull();
    await test_db.experimentSessionsServer.save({
        experimentSessionId: 1,
        experimentId: 99,
        clients: [4, 5, 3],
        sessionStartTime: new Date(),
        sessionCompleted: true,
        sessionCompleteTime: new Date(),
    });
    list = await test_db.experimentSessionsServer.getList();
    expect(list.length).toBe(2);
    exp = await test_db.experimentSessionsServer.read(1);
    expect(exp.experimentId).toBe("99");
    expect(exp.sessionCompleted).toBeTruthy();
});
