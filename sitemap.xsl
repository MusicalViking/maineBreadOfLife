<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'>
	<xsl:output method='html' indent='yes' />
	<xsl:template match='/'>
		<html>
			<head>
				<title>Sitemap - Maine Bread of Life</title>
				<style>
					body { font-family: Arial; margin: 2rem }
					ul { list-style: none; padding: 0 }
					li { margin: 0.5rem 0 }
					a { color: #054f87; text-decoration: none }
					a:hover { text-decoration: underline }
					span { color: #666; font-size: 0.9rem; margin-left: 0.5rem }
				</style>
			</head>
			<body>
				<h1>Website URLs</h1>
				<ul>
					<xsl:for-each select='urlset/url'>
						<li>
							<a href="{loc}">
								<xsl:value-of select="loc" />
							</a>
							<span>
								(Last modified: <xsl:value-of select="lastmod" />)
							</span>
						</li>
					</xsl:for-each>
				</ul>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>