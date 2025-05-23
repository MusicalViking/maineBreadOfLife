<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap - Bread of Life</title>
        <style>body {font-family: Arial; margin: 2rem} table {width: 100%; border-collapse: collapse} th, td {padding: 8px; text-align: left; border-bottom: 1px solid #ddd}</style>
      </head>
      <body>
        <h1>Website Sitemap</h1>
        <table>
          <tr><th>URL</th><th>Last Modified</th><th>Priority</th></tr>
          <xsl:for-each select="urlset/url">
            <tr>
              <td><xsl:value-of select="loc"/></td>
              <td><xsl:value-of select="lastmod"/></td>
              <td><xsl:value-of select="priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
