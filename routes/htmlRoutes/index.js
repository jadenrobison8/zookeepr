const path = require('path');
const router = require('express').Router();

//route used to create a homepage for a server. communicates with html file
router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

//route to animals html page
router.get('/animals', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

//route to zookeepers html
router.get('/zookeepers', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

//wildcard route(should always be the last route)
router.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;