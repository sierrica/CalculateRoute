/**
 * An element that visualizes the connection between a flexible element and its
 * original position. This base class doesn't perform any drawing - you have to
 * use a subclass to actually see the connection.
 * <p>
 * Sample code: {@sample Flexible elements (1)},
 *              {@sample Flexible elements (2)},
 *              {@sample Custom flex markers}
 * 
 * @param   flexElementId {var} the id of the flexible element.
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the flex marker element.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.FlexMarker",
                  com.ptvag.webcomponent.map.vector.VectorElement,
function(flexElementId, priority, id) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id);

    var self = this;

    self.setFlexElementId(flexElementId);

    self.refreshOn("flexElementId");
});

/** The id of the flexible element. */
qxp.OO.addProperty({ name:"flexElementId", allowNull:false });
