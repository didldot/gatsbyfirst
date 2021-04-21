const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if(node.internal.type === 'MarkdownRemark'){
        const slug = createFilePath({ node, getNode, basePath: 'pages' });
        createNodeField({
            node,
            name: 'slug',
            value: slug,
        });
        
        //console.log(createFilePath({ node, getNode, basePath: 'pages' }));
        //const fileNode = getNode(node.parent);
        // console.log('\n', fileNode.relativePath);
        //console.log(`Node created of type ' "${node.internal.type}"`);
    }
}

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  //console.log(JSON.stringify(result, null, 4))
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}