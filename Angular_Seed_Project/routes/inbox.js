var express = require('express');
var router = express.Router();
var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'pedro.strabeli@certsys.com.br',
  password: 'senha',
  host: 'webmail.exchange.locaweb.com.br', //this is locaweb's exchange host. formerly was using imap.gmail.com',
  port: 993,
  tls: {
    secureProtocol: "TLSv1_method"
  },
  secure: true
});

var maillist='';
/* GET home page. */
router.get('/', function(req, res, next) {
    imap.connect();
    
    console.log('denovo novo');
    console.log('denovo novo');
    console.log('denovo novo');
    console.log('denovo novo');
    console.log(maillist);
    res.send(maillist);
//    json.stringify(maillist);
//    next();
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);    
    }

    imap.once('ready', function() {
      openInbox(function(err, box) {
        if (err) throw err;
        var f = imap.seq.fetch('113:115', {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
          markseen: true,
          struct: true
        });
        f.on('message', function(msg, seqno) {
          console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function(stream, info) {
            var buffer = '';
            stream.on('data', function(chunk) {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', function() {
              //console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                maillist += (inspect(Imap.parseHeader(buffer))); //aqui ele enche o maillist com os itens.
               //console.log("maillist: " + inspect(maillist));
                
            });
          });
          msg.once('attributes', function(attrs) {
//            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
          });
          msg.once('end', function() {
            console.log(prefix + 'Finished');
          });
        });
        f.once('error', function(err) {
          console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
          console.log('Done fetching all messages!');
          imap.end();
          //console.log ("again");
//          console.log(maillist); //aqui ele imprime o negócio todo
        });
          //console.log(f);
          //res.send(f);
          
      });
    });
    
    imap.once('error', function(err) {
      console.log(err);
    });

    imap.once('end', function() {
      console.log('Connection ended');
    });

    //imap.connect();

module.exports = router;