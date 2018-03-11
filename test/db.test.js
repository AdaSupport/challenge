const { Database } = require('../server/db')
const DB_TEST_PATH = './'
const fs = require('fs')
const path = require('path')

const testDataPath = '../Db/data.test.json';
const file_path = path.join(__dirname, testDataPath);
const rawData = JSON.parse(fs.readFileSync(file_path));


function restoreDefaultFile(){
  var rawData = [
    {
        "title": "Order more coffee from Pilot"
    },
    {
        "title": "Clean the coffee machine"
    },
    {
        "title": "Sweep the floor"
    },
    {
        "title": "Order a new display for Gordon"
    },
    {
        "title": "Fix the charger for the speaker"
    },
    {
        "title": "Finish making the hiring challenge"
    }];
  fs.writeFileSync(
    path.join(__dirname, testDataPath),
    JSON.stringify(rawData, undefined, 4), 
    (err) => {
      if(err){
        return false;
      }
    }
  );
}

describe('DB Class TEST', () => {
  describe('DB properties', () => {
    let db = null
    beforeEach(() => {
      db = new Database()
      
    });
    test('should have method: connect', () => {
      expect(db.connect).not.toBeNull()
    });
    test('should have method: writeTodosToFile', () => {
      expect(db.writeTodosToFile).not.toBeNull()
    });
    test('should have method: getallTodos', () => {
      expect(db.getAllTodos).not.toBeNull()
    });
    test('should have method: getFirst', () => {
      expect(db.getFirst).not.toBeNull()
    });
    test('should have method: getById', () => {
      expect(db.getById).not.toBeNull()
    });
    test('should have method: getByTitle', () => {
      expect(db.getByTitle).not.toBeNull()
    });
    test('should have method: insertOne', () => {
      expect(db.insertOne).not.toBeNull()
    });
    test('should have method: deleteOneById', () => {
      expect(db.deleteOneById).not.toBeNull()
    });
    test('should have method: deleteOneByTitle', () => {
      expect(db.deleteOneByTitle).not.toBeNull()
    });

  })

  // describe('Test DB initial', () => {
  //   let db = null;

  //   beforeEach(() => {
  //     db = new Database()
  //   });

  //   afterAll(() => {
  //     restoreDefaultFile();
  //   })
  //   test('should have a empty list without connecting to any file', ()=>{
  //     const todos = db.getAllTodos()
  //     expect(todos).toEqual([])
  //   });

  //   test('should not be able to connect to non-exist file', () => {
  //     const res = db.connect('./data.test.json');
  //     expect(res).toBeFalsy();

  //   });

  //   test('should be able to connect testing file and has a default list', () => {
  //     const res = db.connect(testDataPath);
  //     expect(res).toBeTruthy();
  //     expect(db.getAllTodos()).toHaveLength(6);
  //   });
  // });

  // describe('Test DB behavior after connect', () => {
  //   let db = null
  //   beforeAll(() => {
  //     db = new Database();
  //     db.connect(testDataPath);
  //   })

  //   afterAll(()=> {
  //     restoreDefaultFile();
  //     db = null;
  //   })


  //   test('every todo in the file should have a title and id', () => {
  //     const file_path = path.join(__dirname, testDataPath);
  //     const rawData = JSON.parse(fs.readFileSync(file_path));
  //     expect(rawData).toHaveLength(6);
  //     rawData.forEach(todo => {
  //       expect(todo).toHaveProperty('title');
  //       expect(todo).toHaveProperty('_id');
  //     });
  //   })

  //   test('should be able to get all todos', () => {
  //     const todos = db.getAllTodos();
  //     expect(todos).toHaveLength(6);
  //   });

  //   test('should be able to insert one and get one by its id', () => {
  //     const inserted = db.insertedOne('Test 1');
  //     expect(inserted).toHaveLength(6);
  //   });
  // });
})

