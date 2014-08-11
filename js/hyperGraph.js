$(document).ready(function(){

	var width = 1260,
        height = 600;
    document.getElementById("graph").innerHTML='';

    var svg = d3.select("#graph").append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "graphsvg")
            .append("g").attr("id","hyper");

  var hyperEdges=svg.append("g").attr("id","hyperEdges");
	var reactionNodes=svg.append("g").attr("id","Nodes");

  d3.json("graph.json", function(error, graph) {
  // console.log(graph);


	var node = svg.append("g").attr("id", "Nodes")
        .attr("class", "node")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("id",function(d,i){return d['id'];})
        .attr("cx", function(d) { return d['x']; })
        .attr("cy", function(d) { return d['y']; })
        .attr("r",12)
        .attr("style","cursor: move;stroke-width:1.5px;stroke:#000;")
        .style("fill","#ccc");

    var edgeNode = svg.append("g").attr("id", "edgeNodes")
        .attr("class", "edgeNode")
        .selectAll(".edgeNode")
        .data(graph.edgeNodes)
        .enter().append("circle")
        .attr("id",function(d,i){return d['id'];})
        .attr("cx", function(d) { return d['x']; })
        .attr("cy", function(d) { return d['y']; })
        .attr("r",12)
        .attr("style","cursor: move;fill-opacity:0;");

    var text = svg.selectAll(".nodetext")
        .data(graph.nodes)
        .enter()
        .append("text")
        .attr("class", "nodetext")
        .text(function (d) { return d['id'];
            })
        .attr("dx", 18)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return "translate(" + d['x'] + "," + d['y']  + ")"; });   

    var text2 = svg.selectAll(".edgenodetext")
        .data(graph.edgeNodes)
        .enter()
        .append("text")
        .attr("class", "edgenodetext")
        .text(function (d) { return d['id'];
            })
        .attr("dx", 10)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return "translate(" + d['x'] + "," + d['y']  + ")"; });       

		for(var i=0; i<graph.edgeNodes.length;i++){

			var edgenode=graph.edgeNodes[i];
			var answer=createEdges(graph.edges,graph.nodes,edgenode);
			var tangent=parseFloat(parseFloat(answer[0])*180/Math.PI);
			var control=answer[1];

			hyperEdges.append("g").attr("id",edgenode.id)
			.selectAll("path")
			.data(control)
			.enter().append("path")
			.attr("id",function(d){return d[0].id;})
			.attr("d",function(d){return "M"+d[0].x+","+d[0].y+" Q"+d[1].x+","+d[1].y+" "+edgenode.x+","+edgenode.y;})
			.attr("stroke","#000")
			.attr("stroke-width","1.5px")
			.attr("fill","none");

		}

		node.call(d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart",hyper_drag)
        .on("drag", for_drag));

        edgeNode.call(d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart",hyper_drag)
        .on("drag", for_drag));


     function hyper_drag(d){
           d3.event.sourceEvent.stopPropagation();
        }
            
        function for_drag(d) {
          
              d['x'] = d3.event.x;
              d['y'] = d3.event.y;
              
              d3.select(this).attr("cx", d['x']).attr("cy", d['y']);
              var result=$.grep(graph.edges, function(e){ return (e.target==d['id'] || e.source==d['id']);});
              for(var res=0;res<result.length; res++){

                if(result[res].source[0]=='n'){
                  var rn=$.grep(graph.edgeNodes, function(e){ return (e.id==result[res].target) ;});

                }
                else{
                    var rn=$.grep(graph.edgeNodes, function(e){ return (e.id==result[res].source) ;});                  
                }              
                    var rnode={id:rn[0].id,x:rn[0].x,y:rn[0].y};
                    var answer=createEdges(graph.edges,graph.nodes,rnode);
                    var tangent=parseFloat(parseFloat(answer[0])*180/Math.PI);
                    var control=answer[1];
                  
                    for(var c=0; c<control.length;c++){
                      var edgeLine=control[c][0];
                      var controlLine=control[c][1];
                      document.getElementById(edgeLine.id).setAttribute("d","M"+edgeLine.x+","+edgeLine.y+" Q"+controlLine.x+","+controlLine.y+" "+rnode.x+","+rnode.y);
                    }
                    
              }
             
             text.attr("transform", function(d) {
                 return "translate(" + d.x + "," + d.y + ")";});  
             text2.attr("transform", function(d) {
                 return "translate(" + d.x + "," + d.y + ")";});  

        }  
  
    

        });

    
});



function rxnTangent(inEdges,outEdges,edgenode){
    var angle=0;
    var d=0;
    for(var n in inEdges){
      var dx=parseFloat(edgenode.x)-parseFloat(inEdges[n].x);
      var dy=parseFloat(edgenode.y)-parseFloat(inEdges[n].y);
      angle=angle+Math.atan(parseFloat(dy)/parseFloat(dx));
      d=d+1;
    }
    
    for(var out in outEdges){
      var dx=outEdges[out].x-edgenode.x ;
      var dy=outEdges[out].y-edgenode.y;
      angle=angle+Math.atan(parseFloat(dy)/parseFloat(dx));
      d=d+1;
    }
    return parseFloat(angle/d);
  }

  function controlPoint(radian,edgenode,node1){
    var r= Math.cos(radian)*(parseFloat(node1.x)-parseFloat(edgenode.x))+Math.sin(radian)*(parseFloat(node1.y)-parseFloat(edgenode.y));
    var control={};
    control.x=parseFloat(parseFloat(r)*parseFloat(Math.cos(radian))+parseFloat(edgenode.x));
    control.y=parseFloat(parseFloat(r)*parseFloat(Math.sin(radian))+parseFloat(edgenode.y));
    return control;
  }


function createEdges(edges,nodes,edgenode){
  		var inedges={};
        var outedges={};
        for(var j=0;j<edges.length;j++){
              if(edges[j].target==edgenode.id){
                var result=$.grep(nodes, function(e){ return e.id ==edges[j].source;});
                
                  inedges[result[0].id]={id:edges[j].id,x:result[0].x,y:result[0].y};
              }
              else if(edges[j].source==edgenode.id){
              	console.log(edges[j].source);
              	console.log(nodes);	
                var result=$.grep(nodes, function(e){return e.id ==edges[j].target;} );
                console.log(result);
                  outedges[result[0].id]={id:edges[j].id,x:result[0].x,y:result[0].y};
              }

        }

		var angle= parseFloat(rxnTangent(inedges,outedges,edgenode));
		var allnodes=[];
		var control=[];
		allnodes.push(edgenode);
		var newtangent;
		var left=true;
		var right =true;
		var up=true;
		var down=true;
		for(var n in inedges){
			if(parseFloat(inedges[n].x)>parseFloat(edgenode.x)){
			  left=false;
			}
			if(parseFloat(inedges[n].y)>parseFloat(edgenode.y)){
			  up=false;
			}

			allnodes.push(inedges[n]);
		}
		for(var n in outedges){
			if(parseFloat(outedges[n].x)<parseFloat(edgenode.x)){
			  right=false;
			}
			if(parseFloat(outedges[n].y)<parseFloat(edgenode.y)){
			  down=false;
			}
			allnodes.push(outedges[n]);
		}

		if(left && right){
			newtangent=angle;
		}
		else if(left && !right){
			if(!up && !down){
			    newtangent=angle-Math.PI/2; 
			}
			else{
			  newtangent=angle+Math.PI/2; 
			}
		}
		else if(!left && right){
			if(!up && !down){
				newtangent=angle-Math.PI/2; 
			}
			else{
			  newtangent=angle+Math.PI/2; 
			}
		}
		else if(!left && !right){
			if(!up && !down){
			 newtangent=angle-Math.PI; 
			}
			else{
			  newtangent=angle+Math.PI; 
			}

		}

		for(var j in inedges){
		var temp=[];
		var c=controlPoint(newtangent,edgenode,inedges[j]);
		temp.push(inedges[j]);
		temp.push(c);
		control.push(temp);
		}
		for(var j in outedges){
		var temp=[];
		var c=controlPoint(newtangent,edgenode,outedges[j]);
		temp.push(outedges[j]);
		temp.push(c);
		control.push(temp);
		}

		var answer=[];
		answer.push(newtangent);
		answer.push(control);

		return answer;

}
